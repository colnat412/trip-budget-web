import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

interface GoogleRequestBody {
  credential?: string;
}

const NEXT_PUBLIC_IDENTITY_SERVICE_URL =
  process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL || 'http://localhost:8888';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as GoogleRequestBody;
    const { credential } = body;

    if (!credential) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Google credential token is required',
          data: null,
        },
        { status: 400 },
      );
    }

    let identityResponse;
    try {
      identityResponse = await axios.post(
        `${NEXT_PUBLIC_IDENTITY_SERVICE_URL}/api/auth/google`,
        {
          credential,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as {
          message?: string | string[];
        };
        const errorMessage = Array.isArray(errorData?.message)
          ? errorData.message.join(', ')
          : errorData?.message || 'Error during Google login';

        return NextResponse.json(
          {
            status: error.response.status,
            message: errorMessage,
            data: null,
          },
          { status: error.response.status },
        );
      }
      throw error;
    }

    const identityData = identityResponse.data;
    const accessToken =
      identityData?.data?.accessToken || identityData?.accessToken;
    const user = identityData?.data?.user || identityData?.user || null;

    const response = NextResponse.json(
      {
        status: 200,
        message: 'Google login successful',
        data: {
          accessToken,
          user,
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
            maxAge: 30 * 24 * 60 * 60,
          });
        }
      }
    }

    return response;
  } catch (error) {
    console.error('Error during BFF Google login:', error);
    return NextResponse.json(
      {
        status: 500,
        message:
          'Unable to connect to authentication service. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
  }
}
