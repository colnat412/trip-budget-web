import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

interface LoginRequestBody {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

const IDENTITY_SERVICE_URL =
  process.env.IDENTITY_SERVICE_URL || 'http://localhost:3000';

// auto call when post /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as LoginRequestBody;
    const { email, password, rememberMe = false } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Email and password are required',
          data: null,
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    let identityResponse;
    try {
      identityResponse = await axios.post(
        `${IDENTITY_SERVICE_URL}/api/auth/login`,
        {
          email: normalizedEmail,
          password,
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
          : errorData?.message || 'Email or password is not valid';

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

    const response = NextResponse.json(
      {
        status: 200,
        message: 'Login successful',
        data: {
          accessToken,
        },
      },
      { status: 200 },
    );

    const accessTokenMaxAge = rememberMe
      ? 15 * 24 * 60 * 60 // 15 days
      : 15 * 60; // 15 mins

    if (accessToken) {
      response.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: accessTokenMaxAge,
      });
    }

    const rawSetCookies =
      (identityResponse.headers['set-cookie'] as string[]) ?? [];
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
            path: '/api/auth',
            maxAge: 15 * 24 * 60 * 60,
          });
        }
      }
    }

    return response;
  } catch (error) {
    console.error('Error during BFF login:', error);
    return NextResponse.json(
      {
        status: 500,
        message:
          'Cannot connect to authentication service. Please try again later.',
        data: null,
      },
      { status: 500 },
    );
  }
}
