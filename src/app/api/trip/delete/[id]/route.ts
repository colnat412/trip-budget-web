import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const CORE_SERVICE_URL =
  process.env.CORE_SERVICE_URL || 'http://localhost:8081';

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

    const response = await axios.put(
      `${CORE_SERVICE_URL}/api/trip/delete/${id}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
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
