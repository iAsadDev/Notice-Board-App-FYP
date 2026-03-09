import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notice from '@/lib/models/Notice';
import { verifyToken } from '@/lib/utils';

// GET single notice
export async function GET(request, { params }) {
  try {
    await connectDB();

    const notice = await Notice.findById(params.id)
      .populate('createdBy', 'name email');

    if (!notice) {
      return NextResponse.json(
        { message: 'Notice not found' },
        { status: 404 }
      );
    }

    // Increment view count
    notice.views += 1;
    await notice.save();

    return NextResponse.json(notice, { status: 200 });
  } catch (error) {
    console.error('Get notice error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update notice
export async function PUT(request, { params }) {
  try {
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const notice = await Notice.findById(params.id);

    if (!notice) {
      return NextResponse.json(
        { message: 'Notice not found' },
        { status: 404 }
      );
    }

    // Check permission (admin or creator)
    if (decoded.role !== 'admin' && notice.createdBy.toString() !== decoded.id) {
      return NextResponse.json(
        { message: 'You do not have permission to update this notice' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Update notice
    const updatedNotice = await Notice.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    return NextResponse.json(
      {
        message: 'Notice updated successfully',
        notice: updatedNotice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update notice error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE notice
export async function DELETE(request, { params }) {
  try {
    // Verify authentication
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Only admin can delete notices
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { message: 'Only administrators can delete notices' },
        { status: 403 }
      );
    }

    await connectDB();

    const notice = await Notice.findByIdAndDelete(params.id);

    if (!notice) {
      return NextResponse.json(
        { message: 'Notice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Notice deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete notice error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}