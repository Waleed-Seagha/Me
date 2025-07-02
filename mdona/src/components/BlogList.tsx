import React, { useEffect, useState } from 'react';
import { BlogPost } from '@/components/BlogPost';
import { BlogPost as BlogPostType } from '@/types/blog';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogList() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/data/posts.json');
        if (!response.ok) {
          throw new Error(`فشل جلب التدوينات: ${response.status}`);
        }
        const data = await response.json();
        
        // Sort posts by date (newest first)
        const sortedPosts = data.posts.sort(
          (a: BlogPostType, b: BlogPostType) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setPosts(sortedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('حدث خطأ أثناء جلب التدوينات. يرجى المحاولة مرة أخرى لاحقًا.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive text-center">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-md">
        <p className="text-muted-foreground text-center">لم يتم العثور على تدوينات.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
}