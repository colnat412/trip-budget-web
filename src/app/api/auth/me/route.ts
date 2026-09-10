import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const IDENTITY_SERVICE_URL =
  process.env.IDENTITY_SERVICE_URL || 'http://localhost:8888';

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

    const response = await axios.get(`${IDENTITY_SERVICE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    const userPayload = response.data?.data ?? response.data;

    return NextResponse.json(
      {
        status: 200,
        message: 'User profile retrieved successfully',
        data: userPayload,
      },
      { status: 200 },
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          status: error.response.status,
          message:
            error.response.data?.message || 'Error fetching user profile',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error('Error in BFF GET /api/auth/me:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Cannot connect to Identity service. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
  }
}
