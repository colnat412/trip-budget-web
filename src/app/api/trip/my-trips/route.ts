import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const CORE_SERVICE_URL =
  process.env.CORE_SERVICE_URL || 'http://localhost:8081';

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
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '10';

    const response = await axios.get(`${CORE_SERVICE_URL}/api/trip/my-trips`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

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
