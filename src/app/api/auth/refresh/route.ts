import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

const IDENTITY_SERVICE_URL =
  process.env.IDENTITY_SERVICE_URL || 'http://localhost:8888';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      const response = NextResponse.json(
        {
          status: 401,
          message: 'No refresh token provided. Please login again.',
          data: null,
        },
        { status: 401 },
      );
      response.cookies.set('access_token', '', { path: '/', maxAge: 0 });
      response.cookies.set('refresh_token', '', {
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    let identityResponse;
    try {
      identityResponse = await axios.post(
        `${IDENTITY_SERVICE_URL}/api/auth/refresh`,
        {},
        {
          headers: {
            Cookie: `refresh_token=${refreshToken}`,
            Accept: 'application/json',
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorResponse = NextResponse.json(
          {
            status: error.response.status,
            message:
              error.response.data?.message ||
              'Session expired or invalid refresh token.',
            data: null,
          },
          { status: error.response.status },
        );
        errorResponse.cookies.set('access_token', '', { path: '/', maxAge: 0 });
        errorResponse.cookies.set('refresh_token', '', {
          path: '/',
          maxAge: 0,
        });
        return errorResponse;
      }
      throw error;
    }

    const identityData = identityResponse.data;
    const accessToken =
      identityData?.data?.accessToken || identityData?.accessToken;

    const response = NextResponse.json(
      {
        status: 200,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
        },
      },
      { status: 200 },
    );

    if (accessToken) {
      response.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60, // 15 mins
      });
    }

    const setCookieHeader = identityResponse.headers['set-cookie'];
    const rawSetCookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : typeof setCookieHeader === 'string'
        ? [setCookieHeader]
        : [];

    for (const cookieStr of rawSetCookies) {
      if (cookieStr.startsWith('refresh_token=')) {
        const tokenValue = cookieStr
          .split(';')[0]
          .replace('refresh_token=', '');
        if (tokenValue) {
          response.cookies.set('refresh_token', tokenValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30 days
          });
        }
      }
    }

    return response;
  } catch (error) {
    console.error('Error during BFF token refresh:', error);
    const errorResponse = NextResponse.json(
      {
        status: 500,
        message:
          'Cannot connect to authentication service. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
    return errorResponse;
  }
}
