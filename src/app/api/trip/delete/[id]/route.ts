import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

import {
  expirePublicTripCache,
  getTripShareToken,
} from '@/features/trip/api/public-trip.server';

const NEXT_PUBLIC_CORE_SERVICE_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          status: 401,
          message: 'Unauthorized. Please login first.',
          data: null,
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const shareToken = await getTripShareToken(id, accessToken);

    const response = await axios.put(
      `${NEXT_PUBLIC_CORE_SERVICE_URL}/api/trip/delete/${id}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    );

    expirePublicTripCache(shareToken);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        error.response.data || {
          status: error.response.status,
          message: 'Error deleting trip in core service',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error('Error in BFF PUT /api/trip/delete/[id]:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Cannot connect to Trip service. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
  }
}
