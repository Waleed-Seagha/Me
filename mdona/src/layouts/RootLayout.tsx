import React, { ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Add particles effect
  useEffect(() => {
    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-primary rounded-full';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.opacity = '0.7';
      particle.style.transform = 'scale(0)';
      particle.style.transition = 'all 1s ease-out';
      
      document.body.appendChild(particle);
      
      setTimeout(() => {
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(${Math.random() * 3})`;
        particle.style.opacity = '0';
      }, 10);
      
      setTimeout(() => {
        particle.remove();
      }, 1000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.9) {
        createParticle(e.clientX, e.clientY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col smooth-scroll" dir="rtl" 
         style={{ 
           backgroundColor: 'var(--background-color)', 
           color: 'var(--text-color)',
           backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(18, 249, 6, 0.03) 0%, transparent 25%)'
         }}>
      <header className="sticky top-0 z-10 border-b backdrop-blur supports-[backdrop-filter]:bg-background/60"
              style={{ 
                borderColor: 'var(--border-color)', 
                boxShadow: '0 4px 15px rgba(18, 249, 6, 0.15)',
                background: 'var(--background-color)',
              }}>
        <div className="container flex h-16 items-center justify-between">
          <nav>
            <Link 
              to="/" 
              className="flex items-center space-x-2 font-bold text-2xl neon-text text-gradient"
            >
              <span className="shimmer">مدونة تقنية</span>
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="pulse-effect rounded-full p-1">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 md:py-10 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
          <div className="rotate-3d w-full h-full opacity-10">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full" 
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  background: `radial-gradient(circle, var(--primary-color) 0%, transparent 70%)`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3,
                  filter: 'blur(50px)',
                  transform: `translateZ(${i * 50}px)`
                }}
              />
            ))}
          </div>
        </div>
        {children}
      </main>
      <footer className="border-t py-8 md:py-6" style={{ borderColor: 'var(--border-color)' }}>
        <div className="container flex flex-col items-center justify-center text-center gap-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 items-center w-full justify-between">
            <p className="text-sm" style={{ color: 'var(--text-color)' }}>
              تم إنشاء هذه المدونة باستخدام الذكاء الإصطناعي وتُحدّث تلقائيًا كل 24 ساعة عند منتصف الليل.
            </p>
            <p className="text-sm text-gradient neon-text">
              {new Date().getFullYear()} © جميع الحقوق محفوظة
            </p>
          </div>
          
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent my-2"></div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <p className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
              تصميم وتطوير: 
            </p>
            <p className="badge-animated px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-primary/80 to-secondary/80">
              وليد صياغة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}