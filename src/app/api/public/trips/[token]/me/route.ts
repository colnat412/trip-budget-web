import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const NEXT_PUBLIC_CORE_SERVICE_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
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

    const { token } = await context.params;

    const response = await axios.get(
      `${NEXT_PUBLIC_CORE_SERVICE_URL}/api/public/trips/${token}/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    );

    return NextResponse.json(response.data, {
      status: response.status,
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        error.response.data || {
          status: error.response.status,
          message: 'Error fetching viewer status',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error('Error in BFF GET /api/public/trips/[token]/me:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Cannot connect to core service. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
  }
}
