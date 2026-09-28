import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const NEXT_PUBLIC_CORE_SERVICE_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8866';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());

    const response = await axios.get(
      `${NEXT_PUBLIC_CORE_SERVICE_URL}/api/trip/my-trips`,
      {
        params: query,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        error.response.data || {
          status: error.response.status,
          message: 'Error fetching trips from core service',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error('Error in BFF GET /api/trip/my-trips:', error);
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
