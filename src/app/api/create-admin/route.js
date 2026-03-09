import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/utils';

export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password, name } = await request.json();
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Agar user exist karta hai to usse admin bana do
      user.role = 'admin';
      await user.save();
      
      return NextResponse.json({
        message: 'Existing user upgraded to admin successfully',
        user: { email: user.email, role: user.role }
      });
    } else {
      // Naya admin user create karo
      const hashedPassword = await hashPassword(password);
      
      user = await User.create({
        name: name || 'Admin User',
        email,
        password: hashedPassword,
        role: 'admin',
        accountStatus: 'active'
      });
      
      return NextResponse.json({
        message: 'New admin user created successfully',
        user: { email: user.email, role: user.role }
      });
    }
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json(
      { message: 'Error: ' + error.message },
      { status: 500 }
    );
  }
}