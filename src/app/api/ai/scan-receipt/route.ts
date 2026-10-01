import { NextResponse, type NextRequest } from 'next/server';

const AI_SERVICE_URL =
  process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';
const AI_SERVICE_INTERNAL_KEY =
  process.env.AI_SERVICE_INTERNAL_KEY || 'd39ii0q7NIXbVsTh824Sc6ERIREzBQfN';

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

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        {
          status: 400,
          message: 'No receipt file provided or invalid file format.',
          data: null,
        },
        { status: 400 },
      );
    }

    const forwardFormData = new FormData();
    forwardFormData.append('file', file);

    const response = await fetch(`${AI_SERVICE_URL}/api/ai/scan-receipt`, {
      method: 'POST',
      headers: {
        'X-Internal-API-Key': AI_SERVICE_INTERNAL_KEY,
      },
      body: forwardFormData,
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        (responseData && (responseData.detail || responseData.message)) ||
        'Failed to scan receipt with AI service';
      return NextResponse.json(
        {
          status: response.status,
          message: errorMessage,
          data: null,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        status: 200,
        message: 'Receipt scanned successfully',
        data: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in BFF POST /api/ai/scan-receipt:', error);
    return NextResponse.json(
      {
        status: 500,
        message: 'Cannot connect to AI service. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
  }
}
