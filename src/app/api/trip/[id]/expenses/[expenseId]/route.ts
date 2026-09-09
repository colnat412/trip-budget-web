import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const CORE_SERVICE_URL =
  process.env.CORE_SERVICE_URL || 'http://localhost:8081';

interface RouteContext {
  params: Promise<{ id: string; expenseId: string }>;
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

    const { id, expenseId } = await context.params;

    const response = await axios.get(
      `${CORE_SERVICE_URL}/api/trip/${id}/expenses/${expenseId}`,
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
          message: 'Error fetching expense detail',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error(
      'Error in BFF GET /api/trip/[id]/expenses/[expenseId]:',
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

    const { id, expenseId } = await context.params;
    const body = await request.json().catch(() => ({}));

    const response = await axios.put(
      `${CORE_SERVICE_URL}/api/trip/${id}/expenses/${expenseId}`,
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
          message: 'Error updating expense',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error(
      'Error in BFF PUT /api/trip/[id]/expenses/[expenseId]:',
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

    const { id, expenseId } = await context.params;

    const response = await axios.delete(
      `${CORE_SERVICE_URL}/api/trip/${id}/expenses/${expenseId}`,
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
          message: 'Error deleting expense',
          data: null,
        },
        { status: error.response.status },
      );
    }

    console.error(
      'Error in BFF DELETE /api/trip/[id]/expenses/[expenseId]:',
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
