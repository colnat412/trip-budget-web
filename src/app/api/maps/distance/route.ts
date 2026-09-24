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

const serverCache = new Map<string, DistanceElement>();

const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
};

const formatDuration = (seconds: number, lang = 'vi'): string => {
  const mins = Math.round(seconds / 60);
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
  // Average city driving speed: 25 km/h -> ~6.9 m/s
  const seconds = Math.round(meters / 6.5) + 120; // add traffic light buffer

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

    // If API key is available, call Google Distance Matrix API
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
          // Populate server cache
          googleResponse.data.rows.forEach((row, oIdx) => {
            const origin = origins[oIdx];
            row.elements.forEach((elem, dIdx) => {
              const dest = destinations[dIdx];
              if (origin && dest && elem.status === 'OK') {
                const cacheKey = `${origin.trim().toLowerCase()}:::${dest.trim().toLowerCase()}:::${lang}`;
                serverCache.set(cacheKey, elem);
              }
            });
          });

          return NextResponse.json(googleResponse.data);
        }

        console.warn(
          'Google Maps API returned non-OK status:',
          googleResponse.data.status,
        );
      } catch (err) {
        console.warn('Google Maps API request failed, using fallback:', err);
      }
    }

    const fallbackRows: DistanceRow[] = origins.map((origin) => ({
      elements: destinations.map((dest) => {
        const cacheKey = `${origin.trim().toLowerCase()}:::${dest.trim().toLowerCase()}:::${lang}`;
        const cached = serverCache.get(cacheKey);
        if (cached) return cached;

        const generated = calculateHeuristicDistance(origin, dest, lang);
        serverCache.set(cacheKey, generated);
        return generated;
      }),
    }));

    return NextResponse.json({
      origin_addresses: origins,
      destination_addresses: destinations,
      rows: fallbackRows,
      status: 'OK',
      isEstimated: true,
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
