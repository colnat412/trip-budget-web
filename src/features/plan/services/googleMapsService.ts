import axios from 'axios';
import type {
  DistanceResult,
  OptimizationResult,
  PlanActivity,
  RouteSegment,
} from '../types';

const CACHE_PREFIX = 'tb_distance_v2:';

const getCacheKey = (origin: string, dest: string, lang: string) => {
  return `${CACHE_PREFIX}${origin.trim().toLowerCase()}:::${dest.trim().toLowerCase()}:::${lang}`;
};

const getFromLocalCache = (
  origin: string,
  dest: string,
  lang: string,
): DistanceResult | null => {
  if (typeof window === 'undefined') return null;
  try {
    const key = getCacheKey(origin, dest, lang);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DistanceResult;
    if (
      parsed.source === 'heuristic' ||
      (parsed.isEstimated && !parsed.source)
    ) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const saveToLocalCache = (
  origin: string,
  dest: string,
  lang: string,
  result: DistanceResult,
) => {
  if (typeof window === 'undefined') return;
  if (result.source === 'heuristic' || (result.isEstimated && !result.source)) {
    return;
  }
  try {
    localStorage.setItem(
      getCacheKey(origin, dest, lang),
      JSON.stringify(result),
    );
  } catch {
    // Ignore storage quota errors
  }
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
};

export const formatDuration = (seconds: number, lang = 'vi'): string => {
  const mins = Math.max(1, Math.round(seconds / 60));
  if (mins < 60) {
    return lang === 'en' ? `~${mins} mins` : `~${mins} phút`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) {
    return lang === 'en' ? `~${hours} hrs` : `~${hours} giờ`;
  }
  return lang === 'en'
    ? `~${hours} hrs ${remainingMins} mins`
    : `~${hours} giờ ${remainingMins} phút`;
};

export async function fetchDistanceMatrix(
  origins: string[],
  destinations: string[],
  lang = 'vi',
  destinationContext?: string,
): Promise<Map<string, DistanceResult>> {
  const resultMap = new Map<string, DistanceResult>();
  const missingOrigins: string[] = [];
  const missingDestinations: string[] = [];

  origins.forEach((orig) => {
    destinations.forEach((dest) => {
      const cached = getFromLocalCache(orig, dest, lang);
      if (cached) {
        resultMap.set(`${orig}:::${dest}`, cached);
      } else {
        if (!missingOrigins.includes(orig)) missingOrigins.push(orig);
        if (!missingDestinations.includes(dest)) missingDestinations.push(dest);
      }
    });
  });

  if (missingOrigins.length > 0 && missingDestinations.length > 0) {
    try {
      const response = await axios.post('/api/maps/distance', {
        origins: missingOrigins,
        destinations: missingDestinations,
        language: lang,
        destinationContext,
      });

      const data = response.data;
      if (data && Array.isArray(data.rows)) {
        data.rows.forEach(
          (row: { elements: DistanceResult[] }, oIdx: number) => {
            const origin = missingOrigins[oIdx];
            row.elements.forEach((elem: DistanceResult, dIdx: number) => {
              const dest = missingDestinations[dIdx];
              if (origin && dest && elem) {
                resultMap.set(`${origin}:::${dest}`, elem);
                saveToLocalCache(origin, dest, lang, elem);
              }
            });
          },
        );
      }
    } catch (error) {
      console.error(
        'Error fetching distance matrix from /api/maps/distance:',
        error,
      );
    }
  }

  return resultMap;
}

export async function getConsecutiveDistances(
  activities: PlanActivity[],
  lang = 'vi',
  destinationContext?: string,
): Promise<{
  segments: RouteSegment[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  formattedTotalDistance: string;
  formattedTotalDuration: string;
}> {
  const locActivities = activities.filter(
    (a) => a.location && a.location.trim().length > 0,
  );

  if (locActivities.length < 2) {
    return {
      segments: [],
      totalDistanceMeters: 0,
      totalDurationSeconds: 0,
      formattedTotalDistance: '0 km',
      formattedTotalDuration: '0 phút',
    };
  }

  const origins: string[] = [];
  const destinations: string[] = [];

  for (let i = 0; i < locActivities.length - 1; i++) {
    const fromLoc = locActivities[i].location!.trim();
    const toLoc = locActivities[i + 1].location!.trim();
    if (!origins.includes(fromLoc)) origins.push(fromLoc);
    if (!destinations.includes(toLoc)) destinations.push(toLoc);
  }

  const matrix = await fetchDistanceMatrix(
    origins,
    destinations,
    lang,
    destinationContext,
  );

  const segments: RouteSegment[] = [];
  let totalDistanceMeters = 0;
  let totalDurationSeconds = 0;

  for (let i = 0; i < locActivities.length - 1; i++) {
    const fromAct = locActivities[i];
    const toAct = locActivities[i + 1];
    const fromLoc = fromAct.location!.trim();
    const toLoc = toAct.location!.trim();

    const info = matrix.get(`${fromLoc}:::${toLoc}`) || {
      distance: { text: '2.5 km', value: 2500 },
      duration: { text: lang === 'en' ? '~8 mins' : '~8 phút', value: 480 },
      isEstimated: true,
    };

    totalDistanceMeters += info.distance.value;
    totalDurationSeconds += info.duration.value;

    segments.push({
      fromActivityId: fromAct.id,
      toActivityId: toAct.id,
      origin: fromLoc,
      destination: toLoc,
      distance: info.distance,
      duration: info.duration,
      isEstimated: info.isEstimated,
      source: info.source,
    });
  }

  return {
    segments,
    totalDistanceMeters,
    totalDurationSeconds,
    formattedTotalDistance: formatDistance(totalDistanceMeters),
    formattedTotalDuration: formatDuration(totalDurationSeconds, lang),
  };
}

export async function solveOptimalRoute(
  activities: PlanActivity[],
  options?: {
    startIndex?: number;
    lang?: string;
    destinationContext?: string;
  },
): Promise<OptimizationResult> {
  const lang = options?.lang || 'vi';
  const startIndex = options?.startIndex ?? 0;
  const destinationContext = options?.destinationContext;

  const locActivities = activities.filter(
    (a) => a.location && a.location.trim().length > 0,
  );
  const noLocActivities = activities.filter(
    (a) => !a.location || a.location.trim().length === 0,
  );

  const defaultResult: OptimizationResult = {
    originalActivities: activities,
    optimizedActivities: activities,
    originalDistanceMeters: 0,
    optimizedDistanceMeters: 0,
    originalDurationSeconds: 0,
    optimizedDurationSeconds: 0,
    savedDistanceMeters: 0,
    savedPercentage: 0,
    savedDurationSeconds: 0,
    formattedOriginalDistance: '0 km',
    formattedOptimizedDistance: '0 km',
    formattedSavedDistance: '0 km',
    formattedOriginalDuration: '0 phút',
    formattedOptimizedDuration: '0 phút',
    formattedSavedDuration: '0 phút',
    isImprovement: false,
    segments: [],
  };

  if (locActivities.length < 3) {
    const consecutive = await getConsecutiveDistances(
      activities,
      lang,
      destinationContext,
    );
    return {
      ...defaultResult,
      originalDistanceMeters: consecutive.totalDistanceMeters,
      optimizedDistanceMeters: consecutive.totalDistanceMeters,
      originalDurationSeconds: consecutive.totalDurationSeconds,
      optimizedDurationSeconds: consecutive.totalDurationSeconds,
      formattedOriginalDistance: consecutive.formattedTotalDistance,
      formattedOptimizedDistance: consecutive.formattedTotalDistance,
      formattedOriginalDuration: consecutive.formattedTotalDuration,
      formattedOptimizedDuration: consecutive.formattedTotalDuration,
      segments: consecutive.segments,
    };
  }

  const uniqueLocations: string[] = [];
  locActivities.forEach((a) => {
    const loc = a.location!.trim();
    if (!uniqueLocations.includes(loc)) uniqueLocations.push(loc);
  });

  const matrix = await fetchDistanceMatrix(
    uniqueLocations,
    uniqueLocations,
    lang,
    destinationContext,
  );

  const getDistance = (fromLoc: string, toLoc: string): number => {
    if (fromLoc === toLoc) return 0;
    const entry = matrix.get(`${fromLoc}:::${toLoc}`);
    return entry?.distance.value ?? 2500;
  };

  const getDuration = (fromLoc: string, toLoc: string): number => {
    if (fromLoc === toLoc) return 0;
    const entry = matrix.get(`${fromLoc}:::${toLoc}`);
    return entry?.duration.value ?? 480;
  };

  let origDist = 0;
  let origDur = 0;
  for (let i = 0; i < locActivities.length - 1; i++) {
    const fromLoc = locActivities[i].location!.trim();
    const toLoc = locActivities[i + 1].location!.trim();
    origDist += getDistance(fromLoc, toLoc);
    origDur += getDuration(fromLoc, toLoc);
  }

  const n = locActivities.length;
  const visited = new Array<boolean>(n).fill(false);
  const route: number[] = [];

  const validStart = startIndex >= 0 && startIndex < n ? startIndex : 0;
  route.push(validStart);
  visited[validStart] = true;

  while (route.length < n) {
    const last = route[route.length - 1];
    const lastLoc = locActivities[last].location!.trim();
    let bestNext = -1;
    let bestDist = Infinity;

    for (let i = 0; i < n; i++) {
      if (!visited[i]) {
        const d = getDistance(lastLoc, locActivities[i].location!.trim());
        if (d < bestDist) {
          bestDist = d;
          bestNext = i;
        }
      }
    }

    if (bestNext !== -1) {
      visited[bestNext] = true;
      route.push(bestNext);
    } else {
      break;
    }
  }

  const computeRouteDistance = (r: number[]): number => {
    let d = 0;
    for (let i = 0; i < r.length - 1; i++) {
      d += getDistance(
        locActivities[r[i]].location!.trim(),
        locActivities[r[i + 1]].location!.trim(),
      );
    }
    return d;
  };

  let bestRoute = [...route];
  let bestDistance = computeRouteDistance(bestRoute);
  let improved = true;
  let iterations = 0;

  while (improved && iterations < 100) {
    improved = false;
    iterations++;

    for (let i = 1; i < n - 1; i++) {
      for (let k = i + 1; k < n; k++) {
        // Reverse subarray from i to k
        const newRoute = [...bestRoute];
        const sub = newRoute.slice(i, k + 1).reverse();
        newRoute.splice(i, sub.length, ...sub);

        const newDist = computeRouteDistance(newRoute);
        if (newDist < bestDistance) {
          bestDistance = newDist;
          bestRoute = newRoute;
          improved = true;
        }
      }
    }
  }

  let optDur = 0;
  const segments: RouteSegment[] = [];
  for (let i = 0; i < bestRoute.length - 1; i++) {
    const fromAct = locActivities[bestRoute[i]];
    const toAct = locActivities[bestRoute[i + 1]];
    const fromLoc = fromAct.location!.trim();
    const toLoc = toAct.location!.trim();
    const dist = getDistance(fromLoc, toLoc);
    const dur = getDuration(fromLoc, toLoc);
    optDur += dur;

    const entry = matrix.get(`${fromLoc}:::${toLoc}`);
    segments.push({
      fromActivityId: fromAct.id,
      toActivityId: toAct.id,
      origin: fromLoc,
      destination: toLoc,
      distance: { text: formatDistance(dist), value: dist },
      duration: { text: formatDuration(dur, lang), value: dur },
      isEstimated: entry?.isEstimated,
      source: entry?.source,
    });
  }

  const reorderedLocActivities = bestRoute.map((origIdx, newIdx) => {
    return {
      ...locActivities[origIdx],
      orderIndex: newIdx,
    };
  });

  const finalOptimizedActivities = [
    ...reorderedLocActivities,
    ...noLocActivities.map((act, idx) => ({
      ...act,
      orderIndex: reorderedLocActivities.length + idx,
    })),
  ];

  const savedDist = Math.max(0, origDist - bestDistance);
  const savedDur = Math.max(0, origDur - optDur);
  const savedPct = origDist > 0 ? Math.round((savedDist / origDist) * 100) : 0;
  const isBetter = savedDist > 200; // at least 200m saved

  return {
    originalActivities: activities,
    optimizedActivities: finalOptimizedActivities,
    originalDistanceMeters: origDist,
    optimizedDistanceMeters: bestDistance,
    originalDurationSeconds: origDur,
    optimizedDurationSeconds: optDur,
    savedDistanceMeters: savedDist,
    savedPercentage: savedPct,
    savedDurationSeconds: savedDur,
    formattedOriginalDistance: formatDistance(origDist),
    formattedOptimizedDistance: formatDistance(bestDistance),
    formattedSavedDistance: formatDistance(savedDist),
    formattedOriginalDuration: formatDuration(origDur, lang),
    formattedOptimizedDuration: formatDuration(optDur, lang),
    formattedSavedDuration: formatDuration(savedDur, lang),
    isImprovement: isBetter,
    segments,
  };
}

export const getGoogleMapsDirectionsUrl = (
  origin: string,
  destination: string,
): string => {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    origin,
  )}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
};
