import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const NEXT_PUBLIC_CORE_SERVICE_URL =
  process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';

interface RouteContext {
  params: Promise<{ id: string; memberId: string }>;
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

    const { id, memberId } = await context.params;
    const body = await request.json();

    const response = await axios.put(
      `${NEXT_PUBLIC_CORE_SERVICE_URL}/api/trip/${id}/members/${memberId}/role`,
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
          message: 'Error updating member role',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error('Error in BFF PUT /api/trip/[id]/members/[memberId]:', error);
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

export async function DELETE(request: NextRequest, context: RouteContext) {
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

    const { id, memberId } = await context.params;

    const response = await axios.delete(
      `${NEXT_PUBLIC_CORE_SERVICE_URL}/api/trip/${id}/members/${memberId}`,
      {
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
          message: 'Error removing member from trip',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error(
      'Error in BFF DELETE /api/trip/[id]/members/[memberId]:',
      error,
    );
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
