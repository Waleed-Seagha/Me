import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dateFormatter";
import { BlogPost as BlogPostType } from "@/types/blog";

interface BlogPostProps {
  post: BlogPostType;
  isExpanded?: boolean;
}

export function BlogPost({ post, isExpanded = false }: BlogPostProps) {
  const tags = post.tags || ["تطوير الويب", "جافاسكربت", "تقنية"];
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 3D card effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !isHovered) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
      
      // Calculate rotation values (limit the angle)
      const maxRotation = 10;
      const xRotation = Math.min(Math.max((y / (rect.height / 2)) * -maxRotation, -maxRotation), maxRotation);
      const yRotation = Math.min(Math.max((x / (rect.width / 2)) * maxRotation, -maxRotation), maxRotation);
      
      setRotation({ x: xRotation, y: yRotation });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered]);

  // Reset rotation when not hovering
  useEffect(() => {
    if (!isHovered) {
      const timeout = setTimeout(() => {
        setRotation({ x: 0, y: 0 });
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      className="perspective-1000 mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className="mb-6 card-3d glow-on-hover relative shimmer"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.3s ease',
          background: 'var(--card-bg)',
          borderColor: 'var(--border-color)',
          boxShadow: isHovered 
            ? '0 25px 50px rgba(18, 249, 6, 0.2), 0 0 15px rgba(18, 249, 6, 0.1)' 
            : '0 10px 30px var(--shadow-color)'
        }}
      >
        {/* Glowing border effect */}
        <div 
          className="absolute inset-0 rounded-lg" 
          style={{ 
            background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end), var(--gradient-start))',
            padding: '2px',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite linear',
            opacity: isHovered ? 0.8 : 0.3,
            zIndex: -1,
            filter: 'blur(3px)',
            transform: 'scale(1.01)',
            transition: 'all 0.3s ease'
          }}
        />

        <CardHeader>
          <CardTitle className="text-3xl font-bold line-clamp-2 headline-3d neon-text"
            style={{
              transform: isHovered ? 'translateZ(30px)' : 'translateZ(0)',
              transition: 'all 0.5s ease',
              color: 'var(--primary-color)'
            }}
          >
            {isExpanded ? (
              <span className="block text-gradient">{post.title}</span>
            ) : (
              <Link to={`/posts/${post.id}`} className="block text-gradient">{post.title}</Link>
            )}
          </CardTitle>
          <div 
            className="text-sm"
            style={{ 
              color: 'var(--text-color)', 
              opacity: 0.8,
              transform: isHovered ? 'translateZ(15px)' : 'translateZ(0)',
              transition: 'all 0.5s ease'
            }}
          >
            نُشر في {formatDate(post.createdAt)}
          </div>
        </CardHeader>
        
        <CardContent
          style={{
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0)',
            transition: 'all 0.5s ease'
          }}
        >
          <div 
            className={`prose prose-lg max-w-none ${isExpanded ? "" : "line-clamp-3"}`}
            style={{ color: 'var(--text-color)' }}
          >
            {post.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </CardContent>
        
        <CardFooter 
          className="flex flex-wrap gap-2 justify-between"
          style={{
            transform: isHovered ? 'translateZ(25px)' : 'translateZ(0)',
            transition: 'all 0.5s ease'
          }}
        >
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="badge-animated"
                style={{
                  background: 'var(--gradient-start)',
                  color: 'var(--background-color)',
                  opacity: 0.8,
                  fontWeight: 'bold'
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {!isExpanded && (
            <Link to={`/posts/${post.id}`}>
              <Button 
                variant="ghost" 
                className="btn-animated"
                style={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'var(--primary-color)',
                  color: 'var(--primary-color)'
                }}
              >
                اقرأ المزيد
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}