import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyToken } from '@/lib/utils';

// PUT update user - FIXED
export async function PUT(request, { params }) {
  try {
    console.log('Update user API called');
    
    // ✅ AWAIT params FIRST - YEH IMPORTANT HAI
    const { id } = await params;
    console.log('User ID to update:', id);

    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    console.log('Decoded user:', decoded);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    console.log('Update data:', body);

    // Prevent changing own role if you're the only admin
    if (id === decoded.id && body.role && body.role !== 'admin') {
      return NextResponse.json(
        { message: 'You cannot demote yourself' },
        { status: 400 }
      );
    }

    // ✅ AB ID USE KARO - params.id nahi, id use karo
    const user = await User.findByIdAndUpdate(
      id,  // ✅ YAHAN AWAITED ID USE HUI HAI
      { $set: body },
      { 
        new: true, 
        runValidators: true,
        returnDocument: 'after' // Fix mongoose warning
      }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User updated:', user._id);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE user - FIXED
export async function DELETE(request, { params }) {
  try {
    console.log('Delete user API called');
    
    // ✅ AWAIT params FIRST
    const { id } = await params;
    console.log('User ID to delete:', id);

    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Prevent deleting yourself
    if (id === decoded.id) {
      return NextResponse.json(
        { message: 'You cannot delete yourself' },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ AB ID USE KARO
    const user = await User.findByIdAndDelete(id);  // ✅ YAHAN AWAITED ID USE HUI HAI

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User deleted:', id);
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}