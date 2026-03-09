import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notice from '@/lib/models/Notice';
import { verifyToken } from '@/lib/utils';

// GET all notices
// GET all notices
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    const limit = parseInt(searchParams.get('limit')) || 50;

    let query = {};
    
    // Agar status specified hai to filter karo
    if (status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const notices = await Notice.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdDate: -1 })
      .limit(limit);

    return NextResponse.json(notices, { status: 200 });
  } catch (error) {
    console.error('Get notices error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new notice - ✅ FIXED VERSION
export async function POST(request) {
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

    // Check if user has permission (admin or publisher)
    if (decoded.role !== 'admin' && decoded.role !== 'publisher') {
      return NextResponse.json(
        { message: 'You do not have permission to create notices' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    console.log('Received notice data:', body);

    const { title, description, category, priority, expiryDate } = body;

    // Validation
    if (!title || !description || !category || !expiryDate) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Calculate status based on expiry date
    const expiryDateObj = new Date(expiryDate);
    const now = new Date();
    const status = expiryDateObj < now ? 'archived' : 'active';

    // Create notice - WITHOUT any pre-save hooks
    const noticeData = {
      title,
      description,
      category,
      priority: priority || 'medium',
      expiryDate: expiryDateObj,
      createdBy: decoded.id,
      status: status, // Set status manually
      views: 0,
      createdDate: now
    };

    console.log('Creating notice with data:', noticeData);

    // ✅ DIRECT INSERTION - bypassing any middleware
    const notice = new Notice(noticeData);
    await notice.save();

    // Populate createdBy field
    await notice.populate('createdBy', 'name email');

    console.log('Notice created successfully:', notice._id);

    return NextResponse.json(
      {
        message: 'Notice created successfully',
        notice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create notice error details:', error);
    return NextResponse.json(
      { message: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}