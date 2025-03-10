
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/30">
      <header 
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 py-4",
          isScrolled ? "bg-background/80 shadow-sm blur-backdrop" : "bg-transparent"
        )}
      >
        <div className="container flex justify-between items-center">
          <h1 className={cn(
            "text-2xl md:text-3xl font-bold tracking-tight transition-all duration-300",
            isScrolled ? "text-primary" : "text-foreground"
          )}>
            حاسبة العمل الإضافي لأبطال السبورت (SUPPORT_HEROES)
          </h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 container py-8 md:py-16">
        {children}
      </main>
      
      <footer className="py-8 border-t border-border/40 bg-secondary/30">
        <div className="container text-center">
          <p className="text-muted-foreground text-sm">
            حاسبة العمل الإضافي لأبطال السبورت وفقاً لنظام العمل السعودي | {currentYear} © abdulrahman-kh.github
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
