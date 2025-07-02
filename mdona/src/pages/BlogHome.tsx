import React, { useRef, useEffect } from 'react';
import RootLayout from '@/layouts/RootLayout';
import { BlogList } from '@/components/BlogList';

export default function BlogHome() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  // Animate elements on page load
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            entry.target.classList.add('fade-in');
            entry.target.classList.add('slide-in-from-bottom-8');
            entry.target.classList.add('duration-700');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    if (subtitleRef.current) observer.observe(subtitleRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (subtitleRef.current) observer.unobserve(subtitleRef.current);
    };
  }, []);

  // Create the 3D grid background
  const createGridElements = () => {
    const elements = [];
    for (let i = 0; i < 20; i++) {
      elements.push(
        <div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            background: 'var(--primary-color)',
            boxShadow: '0 0 10px var(--primary-color)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: -1,
            animation: `pulse ${Math.random() * 3 + 2}s infinite ease-in-out ${Math.random() * 2}s`,
            transform: `translateZ(${Math.random() * 50}px)`
          }}
        />
      );
    }
    return elements;
  };

  return (
    <RootLayout>
      <div className="container mx-auto px-4 relative">
        {/* 3D Grid Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-1000">
          {createGridElements()}
        </div>
        
        <section className="mb-10 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

          <h1 
            ref={titleRef}
            className="text-5xl font-extrabold mb-4 neon-text typing-effect opacity-0"
            style={{
              color: 'var(--primary-color)',
              textShadow: '0 0 15px rgba(18, 249, 6, 0.3)'
            }}
          >
            أحدث التدوينات التقنية
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-secondary mb-6 rounded-full shimmer"></div>
          <p 
            ref={subtitleRef}
            className="text-xl opacity-0"
            style={{ color: 'var(--text-color)' }}
          >
            آخر المستجدات والأدوات في عالم تطوير الويب، بتحديثات يومية تلقائية باستخدام الذكاء الاصطناعي.
          </p>
        </section>
        
        <BlogList />
        
        {/* Floating 3D elements */}
        <div className="absolute top-10 right-0 w-20 h-20 pointer-events-none">
          <div 
            className="w-full h-full rotate-3d opacity-50"
            style={{
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              filter: 'blur(15px)',
              animation: 'float 6s ease-in-out infinite'
            }}
          ></div>
        </div>
        
        <div className="absolute bottom-10 left-0 w-40 h-40 pointer-events-none">
          <div 
            className="w-full h-full rotate-3d opacity-30"
            style={{
              background: 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))',
              borderRadius: '70% 30% 30% 70% / 60% 40% 60% 40%',
              filter: 'blur(25px)',
              animation: 'float 8s ease-in-out infinite reverse'
            }}
          ></div>
        </div>
      </div>
    </RootLayout>
  );
}