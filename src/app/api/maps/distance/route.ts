import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

interface DistanceElement {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  status: string;
  source?: 'google' | 'osm' | 'heuristic';
}

interface DistanceRow {
  elements: DistanceElement[];
}

interface DistanceMatrixResponse {
  origin_addresses: string[];
  destination_addresses: string[];
  rows: DistanceRow[];
  status: string;
  isEstimated?: boolean;
}

// In-memory server cache to minimize Google / OSM API calls
const serverCache = new Map<string, DistanceElement>();
const geocodeCache = new Map<string, { lat: number; lon: number } | null>();

const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
};

const formatDuration = (seconds: number, lang = 'vi'): string => {
  const mins = Math.max(1, Math.round(seconds / 60));
  if (mins < 60) {
    return lang === 'en' ? `${mins} mins` : `${mins} phút`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) {
    return lang === 'en' ? `${hours} hrs` : `${hours} giờ`;
  }
  return lang === 'en'
    ? `${hours} hrs ${remainingMins} mins`
    : `${hours} giờ ${remainingMins} phút`;
};

/**
 * Haversine formula to compute great-circle distance between two points in meters
 */
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

async function queryNominatim(
  q: string,
  restrictVn = true,
): Promise<{ lat: number; lon: number } | null> {
  try {
    const osmUrl = new URL('https://nominatim.openstreetmap.org/search');
    osmUrl.searchParams.set('q', q.trim());
    osmUrl.searchParams.set('format', 'json');
    osmUrl.searchParams.set('limit', '1');
    if (restrictVn) {
      osmUrl.searchParams.set('countrycodes', 'vn');
    }

    const res = await axios.get(osmUrl.toString(), {
      headers: {
        'User-Agent':
          'TripBudgetWeb/1.0 (travel planning app; contact@tripbudget.app)',
        'Accept-Language': 'vi,en;q=0.9',
      },
      timeout: 4000,
    });

    if (
      Array.isArray(res.data) &&
      res.data.length > 0 &&
      res.data[0].lat &&
      res.data[0].lon
    ) {
      return {
        lat: parseFloat(res.data[0].lat),
        lon: parseFloat(res.data[0].lon),
      };
    }
  } catch (err) {
    console.warn(`OSM Geocoding failed for "${q}":`, err);
  }
  return null;
}

/**
 * Geocode text location into coordinates using OpenStreetMap Nominatim
 * Supports destination context (e.g. trip province/city) and country filtering
 */
async function geocodeLocation(
  loc: string,
  destinationContext?: string,
): Promise<{ lat: number; lon: number } | null> {
  const normLoc = loc.trim().toLowerCase();
  const normContext = destinationContext
    ? destinationContext.trim().toLowerCase()
    : '';
  const cacheKey = `${normLoc}@@${normContext}`;

  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  // If already coordinates: "10.7719, 106.6983"
  const coordMatch = loc.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
  if (coordMatch) {
    const coords = {
      lat: parseFloat(coordMatch[1]),
      lon: parseFloat(coordMatch[3]),
    };
    geocodeCache.set(cacheKey, coords);
    return coords;
  }

  // 1. Try search within Vietnam first
  let coords = await queryNominatim(loc, true);

  // 2. If not found and destinationContext exists, append destination context (e.g. "Chùa Hang, An Giang")
  if (!coords && destinationContext && destinationContext.trim().length > 0) {
    const contextQuery = `${loc.trim()}, ${destinationContext.trim()}`;
    coords = await queryNominatim(contextQuery, true);
  }

  // 3. If still not found, try global search (in case the trip is international)
  if (!coords) {
    const globalQuery =
      destinationContext && destinationContext.trim().length > 0
        ? `${loc.trim()}, ${destinationContext.trim()}`
        : loc.trim();
    coords = await queryNominatim(globalQuery, false);
  }

  geocodeCache.set(cacheKey, coords);
  return coords;
}

/**
 * Measure driving distance and duration via OpenStreetMap (OSRM public routing or Haversine fallback)
 */
async function getOsmDistance(
  origin: string,
  dest: string,
  lang: string,
  destinationContext?: string,
): Promise<DistanceElement | null> {
  if (origin.trim().toLowerCase() === dest.trim().toLowerCase()) {
    return {
      distance: { text: '0 m', value: 0 },
      duration: { text: lang === 'en' ? '0 min' : '0 phút', value: 0 },
      status: 'OK',
      source: 'osm',
    };
  }

  const [fromCoords, toCoords] = await Promise.all([
    geocodeLocation(origin, destinationContext),
    geocodeLocation(dest, destinationContext),
  ]);

  if (!fromCoords || !toCoords) {
    return null;
  }

  // 1. Attempt OSRM driving route
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${fromCoords.lon},${fromCoords.lat};${toCoords.lon},${toCoords.lat}?overview=false`;
    const res = await axios.get(osrmUrl, { timeout: 4000 });

    if (
      res.data?.code === 'Ok' &&
      Array.isArray(res.data.routes) &&
      res.data.routes.length > 0
    ) {
      const meters = Math.round(res.data.routes[0].distance);
      const seconds = Math.round(res.data.routes[0].duration);

      return {
        distance: {
          text: formatDistance(meters),
          value: meters,
        },
        duration: {
          text: formatDuration(seconds, lang),
          value: seconds,
        },
        status: 'OK',
        source: 'osm',
      };
    }
  } catch (err) {
    console.warn(`OSRM routing failed between "${origin}" and "${dest}":`, err);
  }

  // 2. Haversine GPS fallback with road winding factor (~1.35x)
  // When coordinates are known but OSRM has no road connection (e.g. pedestrian, rural, islands)
  const straightMeters = calculateHaversineDistance(
    fromCoords.lat,
    fromCoords.lon,
    toCoords.lat,
    toCoords.lon,
  );
  const roadMeters = Math.max(100, Math.round(straightMeters * 1.35));
  const roadSeconds = Math.max(60, Math.round(roadMeters / 8.33) + 120);

  return {
    distance: {
      text: formatDistance(roadMeters),
      value: roadMeters,
    },
    duration: {
      text: formatDuration(roadSeconds, lang),
      value: roadSeconds,
    },
    status: 'OK',
    source: 'osm',
  };
}

/**
 * Deterministic heuristic generator when both Google Maps and OSM fail (or non-geocodable text)
 */
const calculateHeuristicDistance = (
  origin: string,
  dest: string,
  lang = 'vi',
): DistanceElement => {
  if (origin.trim().toLowerCase() === dest.trim().toLowerCase()) {
    return {
      distance: { text: '0 m', value: 0 },
      duration: { text: lang === 'en' ? '0 min' : '0 phút', value: 0 },
      status: 'OK',
      source: 'heuristic',
    };
  }

  let hash = 0;
  const combined = `${origin.trim()}:::${dest.trim()}`;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const meters = 1200 + (absHash % 5600); // 1.2km to 6.8km
  const seconds = Math.round(meters / 6.5) + 120; // 25 km/h + traffic light buffer

  return {
    distance: {
      text: formatDistance(meters),
      value: meters,
    },
    duration: {
      text: formatDuration(seconds, lang),
      value: seconds,
    },
    status: 'OK',
    source: 'heuristic',
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const origins: string[] = Array.isArray(body.origins)
      ? body.origins.filter(Boolean)
      : [];
    const destinations: string[] = Array.isArray(body.destinations)
      ? body.destinations.filter(Boolean)
      : [];
    const lang: string = body.language || 'vi';
    const destinationContext: string | undefined =
      typeof body.destinationContext === 'string' &&
      body.destinationContext.trim().length > 0
        ? body.destinationContext.trim()
        : undefined;

    if (origins.length === 0 || destinations.length === 0) {
      return NextResponse.json(
        {
          status: 'INVALID_REQUEST',
          message: 'origins and destinations are required arrays',
          rows: [],
        },
        { status: 400 },
      );
    }

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Check if everything is already in server memory cache
    let allInCache = true;
    const cachedRows: DistanceRow[] = [];

    for (let i = 0; i < origins.length; i++) {
      const origin = origins[i];
      const elements: DistanceElement[] = [];

      for (let j = 0; j < destinations.length; j++) {
        const dest = destinations[j];
        const cacheKey = `${origin.trim().toLowerCase()}:::${dest.trim().toLowerCase()}:::${lang}`;
        const cached = serverCache.get(cacheKey);

        if (cached) {
          elements.push(cached);
        } else {
          allInCache = false;
          break;
        }
      }

      if (!allInCache) break;
      cachedRows.push({ elements });
    }

    if (allInCache) {
      return NextResponse.json({
        origin_addresses: origins,
        destination_addresses: destinations,
        rows: cachedRows,
        status: 'OK',
      });
    }

    // 1. If API key is available, call Google Distance Matrix API
    if (apiKey && apiKey.trim() !== '') {
      try {
        const googleUrl = new URL(
          'https://maps.googleapis.com/maps/api/distancematrix/json',
        );
        googleUrl.searchParams.set('origins', origins.join('|'));
        googleUrl.searchParams.set('destinations', destinations.join('|'));
        googleUrl.searchParams.set('mode', 'driving');
        googleUrl.searchParams.set('language', lang);
        googleUrl.searchParams.set('key', apiKey.trim());

        const googleResponse = await axios.get<DistanceMatrixResponse>(
          googleUrl.toString(),
          { timeout: 8000 },
        );

        if (
          googleResponse.data &&
          googleResponse.data.status === 'OK' &&
          Array.isArray(googleResponse.data.rows)
        ) {
          googleResponse.data.rows.forEach((row, oIdx) => {
            const origin = origins[oIdx];
            row.elements.forEach((elem, dIdx) => {
              const dest = destinations[dIdx];
              if (origin && dest && elem.status === 'OK') {
                const cacheKey = `${origin.trim().toLowerCase()}:::${dest.trim().toLowerCase()}:::${lang}`;
                const entry: DistanceElement = {
                  ...elem,
                  source: 'google',
                };
                serverCache.set(cacheKey, entry);
              }
            });
          });

          return NextResponse.json(googleResponse.data);
        }

        console.warn(
          'Google Maps API returned non-OK status:',
          googleResponse.data?.status,
        );
      } catch (err) {
        console.warn(
          'Google Maps API request failed, falling back to OSM:',
          err,
        );
      }
    }

    // 2. OpenStreetMap (OSRM) Fallback + Heuristic Fallback
    // Pre-geocode unique locations sequentially with rate-limit protection for Nominatim
    const uniqueLocations = Array.from(
      new Set([...origins, ...destinations].map((l) => l.trim())),
    ).filter(Boolean);

    for (const loc of uniqueLocations) {
      const normLoc = loc.toLowerCase();
      const normContext = destinationContext
        ? destinationContext.toLowerCase()
        : '';
      const cKey = `${normLoc}@@${normContext}`;
      if (!geocodeCache.has(cKey)) {
        await geocodeLocation(loc, destinationContext);
        // Pause 200ms between live requests to respect Nominatim policy
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    const fallbackRows: DistanceRow[] = [];
    let hasHeuristicFallback = false;

    for (let i = 0; i < origins.length; i++) {
      const origin = origins[i];
      const elements: DistanceElement[] = [];

      for (let j = 0; j < destinations.length; j++) {
        const dest = destinations[j];
        const cacheKey = `${origin.trim().toLowerCase()}:::${dest.trim().toLowerCase()}:::${lang}`;
        const cached = serverCache.get(cacheKey);

        if (cached) {
          elements.push(cached);
          if (cached.source === 'heuristic') hasHeuristicFallback = true;
          continue;
        }

        // Try OpenStreetMap (Nominatim + OSRM or GPS Haversine) for real road distance
        const osmResult = await getOsmDistance(
          origin,
          dest,
          lang,
          destinationContext,
        );
        if (osmResult) {
          serverCache.set(cacheKey, osmResult);
          elements.push(osmResult);
          continue;
        }

        // Tier 3: Heuristic estimate ONLY if location cannot be found on map
        hasHeuristicFallback = true;
        const generated = calculateHeuristicDistance(origin, dest, lang);
        // Do not permanently store heuristic results in serverCache to allow future retries
        elements.push(generated);
      }

      fallbackRows.push({ elements });
    }

    return NextResponse.json({
      origin_addresses: origins,
      destination_addresses: destinations,
      rows: fallbackRows,
      status: 'OK',
      isEstimated: hasHeuristicFallback,
    });
  } catch (error) {
    console.error('Error in /api/maps/distance:', error);
    return NextResponse.json(
      {
        status: 'ERROR',
        message: 'Internal error calculating distance',
        rows: [],
      },
      { status: 500 },
    );
  }
}
