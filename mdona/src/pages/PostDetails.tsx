import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import RootLayout from '@/layouts/RootLayout';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/components/BlogPost';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BlogPost as BlogPostType } from '@/types/blog';

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/posts.json');
        if (!response.ok) {
          throw new Error(`فشل جلب التدوينة: ${response.status}`);
        }
        const data = await response.json();
        const foundPost = data.posts.find((p: BlogPostType) => p.id === id);
        
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('لم يتم العثور على التدوينة المطلوبة.');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('حدث خطأ أثناء جلب التدوينة. يرجى المحاولة مرة أخرى لاحقًا.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  return (
    <RootLayout>
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center">
              <ChevronRight className="ml-2 h-4 w-4" />
              العودة إلى الرئيسية
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {post && <BlogPost post={post} isExpanded={true} />}
      </div>
    </RootLayout>
  );
}