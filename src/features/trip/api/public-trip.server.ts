import { revalidateTag } from 'next/cache';

import type { PublicTripSnapshot } from '../types';

const CORE_SERVICE_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';

const SHARE_TOKEN_PATTERN = /^[a-f0-9]{32}$/;

export const PUBLIC_TRIP_REVALIDATE_SECONDS = 60;

export const publicTripCacheTag = (token: string) => `public-trip:${token}`;

export type PublicTripResult =
  | { snapshot: PublicTripSnapshot; errorStatus: null }
  | { snapshot: null; errorStatus: number };

export async function getPublicTripSnapshot(
  token: string,
): Promise<PublicTripResult> {
  if (!SHARE_TOKEN_PATTERN.test(token)) {
    return { snapshot: null, errorStatus: 404 };
  }

  try {
    const response = await fetch(
      `${CORE_SERVICE_URL}/api/public/trips/${token}`,
      {
        headers: { Accept: 'application/json' },
        next: {
          revalidate: PUBLIC_TRIP_REVALIDATE_SECONDS,
          tags: [publicTripCacheTag(token)],
        },
      },
    );

    if (!response.ok) {
      return { snapshot: null, errorStatus: response.status };
    }

    const body = await response.json();
    return { snapshot: body.data as PublicTripSnapshot, errorStatus: null };
  } catch (error) {
    console.error('Error fetching public trip snapshot:', error);
    return { snapshot: null, errorStatus: 500 };
  }
}

export async function getTripShareToken(
  tripId: string,
  accessToken: string,
): Promise<string | null> {
  try {
    const response = await fetch(
      `${CORE_SERVICE_URL}/api/trip/${tripId}/share`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      },
    );
    if (!response.ok) return null;
    const body = await response.json();
    return body.data?.shareToken ?? null;
  } catch {
    return null;
  }
}

export function expirePublicTripCache(
  ...tokens: (string | null | undefined)[]
) {
  for (const token of tokens) {
    if (token) {
      revalidateTag(publicTripCacheTag(token), { expire: 0 });
    }
  }
}
