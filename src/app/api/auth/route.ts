import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const users: any[] = await query(
      'SELECT username, dinas FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        dinas: user.dinas,
      },
    });
  } catch (error: any) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
