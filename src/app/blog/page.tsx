export default function Blog() {
  const posts = [
    {
      title: "Getting Started with Next.js 15",
      excerpt: "Learn about the latest features in Next.js 15 and how to migrate your existing applications.",
      date: "December 15, 2024",
      readTime: "5 min read",
      tags: ["Next.js", "React", "Web Development"]
    },
    {
      title: "Building Accessible React Components",
      excerpt: "A comprehensive guide to creating accessible React components that work for everyone.",
      date: "November 28, 2024",
      readTime: "8 min read",
      tags: ["React", "Accessibility", "Frontend"]
    },
    {
      title: "TypeScript Best Practices for 2024",
      excerpt: "Essential TypeScript patterns and practices that will make your code more maintainable.",
      date: "November 10, 2024",
      readTime: "6 min read",
      tags: ["TypeScript", "Best Practices", "Development"]
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thoughts on software development, web technologies, and lessons learned along the way.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post, index) => (
            <article key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <time>{post.date}</time>
                <span className="mx-2">•</span>
                <span>{post.readTime}</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                {post.title}
              </h2>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
