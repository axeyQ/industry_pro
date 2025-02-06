import { NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import Blog from '@/models/Blog';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const category = decodeURIComponent(params.category);

    const blogs = await Blog.find({ parentCategory: category });
    
    return NextResponse.json(
      { success: true, data: blogs },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blogs by category:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}