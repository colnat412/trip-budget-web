import { NextResponse, type NextRequest } from 'next/server';
import axios from 'axios';

interface RegisterRequestBody {
  name?: string;
  email?: string;
  password?: string;
}

const NEXT_PUBLIC_IDENTITY_SERVICE_URL =
  process.env.NEXT_PUBLIC_IDENTITY_SERVICE_URL || 'http://localhost:8888';

export async function POST(request: NextRequest) {
  try {
    const body = (await request
      .json()
      .catch(() => ({}))) as RegisterRequestBody;
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Please provide all required information',
          data: null,
        },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    let identityResponse;
    try {
      identityResponse = await axios.post(
        `${NEXT_PUBLIC_IDENTITY_SERVICE_URL}/api/auth/register`,
        {
          name: name.trim(),
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
          : errorData?.message || 'Failed to register account';

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

    return NextResponse.json(
      {
        status: 200,
        message: identityResponse.data?.message || 'Registration successful',
        data: identityResponse.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error during BFF register:', error);
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
