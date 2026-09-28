import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const NEXT_PUBLIC_CORE_SERVICE_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';

export async function POST(request: NextRequest) {
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

    const body = await request.json().catch(() => ({}));

    const response = await axios.post(
      `${NEXT_PUBLIC_CORE_SERVICE_URL}/api/trip/create`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
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
          message: 'Error creating trip in core service',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error('Error in BFF POST /api/trip/create:', error);
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
