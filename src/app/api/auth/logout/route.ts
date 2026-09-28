import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const NEXT_PUBLIC_IDENTITY_SERVICE_URL =
  process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL || 'http://localhost:8888';

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;

    if (accessToken) {
      try {
        await axios.post(
          `${NEXT_PUBLIC_IDENTITY_SERVICE_URL}/api/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          },
        );
      } catch (backendError) {
        console.warn('NestJS Identity logout warning:', backendError);
      }
    }

    const response = NextResponse.json(
      {
        status: 200,
        message: 'Logged out successfully',
        data: null,
      },
      { status: 200 },
    );

    response.cookies.set({
      name: 'access_token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    response.cookies.set({
      name: 'refresh_token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Error in BFF POST /api/auth/logout:', error);

    const response = NextResponse.json(
      {
        status: 200,
        message: 'Logged out',
        data: null,
      },
      { status: 200 },
    );

    response.cookies.set({
      name: 'access_token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    response.cookies.set({
      name: 'refresh_token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  }
}
