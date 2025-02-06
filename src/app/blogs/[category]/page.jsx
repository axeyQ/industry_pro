import { Suspense } from 'react';
import BlogCard from "@/components/blogCard";
import Link from 'next/link';

async function getBlogsByCategory(category) {
  try {
    const encodedCategory = encodeURIComponent(category);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const res = await fetch(
      `${baseUrl}/api/admin/blogs/category/${encodedCategory}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const category = decodeURIComponent(params.category);
  const blogs = await getBlogsByCategory(category);

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">{category}</h1>
      </div>

      <Suspense fallback={<div>Loading blogs...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
        {blogs.length === 0 && (
          <p className="text-gray-500">No blogs found in this category.</p>
        )}
      </Suspense>
    </div>
  );
}