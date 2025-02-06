import Image from 'next/image';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';

async function getBlog(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/blogs/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch blog');
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function BlogPage({ params }) {
  const blog = await getBlog(params.id);

  if (!blog) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Banner Image */}
      <div className="relative w-full h-[400px] mb-8">
        <Image
          src={blog.bannerImage || '/default-banner.jpg'}
          alt={blog.title}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* Blog Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12">
            <Image
              src={blog.bannerImage || '/default-banner.jpg'}
              alt={blog.author}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{blog.author}</p>
            <p className="text-gray-600">
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Categories and Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {blog.parentCategory}
        </span>
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
          {blog.category}
        </span>
        {blog.tags?.map((tag, index) => (
          <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Blog Content */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(blog.content) 
        }}
      />
    </article>
  );
}