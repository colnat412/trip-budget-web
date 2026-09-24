import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
  source: 'google' | 'osm';
}

// In-memory cache to save API quota
const placeCache = new Map<string, PlacePrediction[]>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';
    const lang = searchParams.get('lang') || 'vi';

    if (!query || query.length < 2) {
      return NextResponse.json({ predictions: [] });
    }

    const cacheKey = `${query.toLowerCase()}:::${lang}`;
    if (placeCache.has(cacheKey)) {
      return NextResponse.json({ predictions: placeCache.get(cacheKey) });
    }

    const apiKey =
      process.env.GOOGLE_MAPS_API_KEY ||
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    let predictions: PlacePrediction[] = [];

    // 1. Try Google Places Autocomplete if API key is present
    if (apiKey && apiKey.trim() !== '') {
      try {
        const googleUrl = new URL(
          'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        );
        googleUrl.searchParams.set('input', query);
        googleUrl.searchParams.set('key', apiKey.trim());
        googleUrl.searchParams.set('language', lang);

        const res = await axios.get(googleUrl.toString(), { timeout: 4000 });
        if (
          res.data &&
          res.data.status === 'OK' &&
          Array.isArray(res.data.predictions)
        ) {
          predictions = res.data.predictions.map(
            (p: {
              place_id: string;
              description: string;
              structured_formatting?: {
                main_text: string;
                secondary_text: string;
              };
            }) => ({
              placeId: p.place_id,
              mainText: p.structured_formatting?.main_text || p.description,
              secondaryText: p.structured_formatting?.secondary_text || '',
              description: p.description,
              source: 'google',
            }),
          );

          if (predictions.length > 0) {
            placeCache.set(cacheKey, predictions);
            return NextResponse.json({ predictions });
          }
        }
      } catch (gErr) {
        console.warn(
          'Google Places Autocomplete failed, falling back to OSM:',
          gErr,
        );
      }
    }

    // 2. Fallback: OpenStreetMap Nominatim (Free, no API key required)
    try {
      const osmUrl = new URL('https://nominatim.openstreetmap.org/search');
      osmUrl.searchParams.set('q', query);
      osmUrl.searchParams.set('format', 'json');
      osmUrl.searchParams.set('addressdetails', '1');
      osmUrl.searchParams.set('limit', '6');
      osmUrl.searchParams.set('accept-language', lang);

      const osmRes = await axios.get(osmUrl.toString(), {
        headers: {
          'User-Agent': 'TripBudgetWeb/1.0 (travel planning app)',
        },
        timeout: 4000,
      });

      if (Array.isArray(osmRes.data)) {
        predictions = osmRes.data.map(
          (item: {
            place_id?: number | string;
            osm_id?: number | string;
            name?: string;
            display_name: string;
          }) => {
            const rawName = item.name || item.display_name.split(',')[0].trim();
            const rest = item.display_name
              .replace(rawName, '')
              .replace(/^,\s*/, '')
              .trim();

            return {
              placeId: String(item.place_id || item.osm_id || Math.random()),
              mainText: rawName,
              secondaryText: rest || item.display_name,
              description: item.display_name,
              source: 'osm',
            };
          },
        );

        if (predictions.length > 0) {
          placeCache.set(cacheKey, predictions);
        }
      }
    } catch (osmErr) {
      console.warn('OSM Nominatim search failed:', osmErr);
    }

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error('Error in /api/maps/places:', error);
    return NextResponse.json({ predictions: [] });
  }
}
