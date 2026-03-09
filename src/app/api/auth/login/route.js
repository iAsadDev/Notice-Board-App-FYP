import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { comparePassword, generateToken } from '@/lib/utils';

export async function POST(request) {
  try {
    console.log("Login attempt started");
    
    await connectDB();
    console.log("Database connected");

    const body = await request.json();
    console.log("Login attempt for email:", body.email);

    const { email, password } = body;

    // Validation
    if (!email || !password) {
      console.log("Missing fields");
      return NextResponse.json(
        { message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user
    console.log("Searching for user...");
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("User not found with email:", email);
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log("User found:", { id: user._id, email: user.email, role: user.role });

    // Check if account is active
    if (user.accountStatus !== 'active') {
      console.log("Account not active:", user.accountStatus);
      return NextResponse.json(
        { message: 'Your account is not active. Please contact admin.' },
        { status: 403 }
      );
    }

    // Verify password
    console.log("Verifying password...");
    const isValidPassword = await comparePassword(password, user.password);
    console.log("Password valid:", isValidPassword);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    console.log("Generating token...");
    const token = generateToken(user);

    // Create response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    console.log("Login successful for:", email);
    return response;
  } catch (error) {
    console.error('Login error details:', error);
    return NextResponse.json(
      { message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}