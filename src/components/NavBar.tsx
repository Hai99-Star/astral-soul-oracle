
import React, { useState, useEffect } from 'react';
import { Moon, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3 md:px-8",
        isScrolled 
          ? "bg-background/80 backdrop-blur-lg shadow-lg" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Moon className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl md:text-2xl font-serif tracking-wide">
            <span className="text-foreground">Astral</span>
            <span className="text-primary">Soul</span>
            <span className="text-accent">Oracle</span>
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <a href="#astrology" className="hover:text-accent transition-colors duration-200">Tử Vi</a>
          <a href="#numerology" className="hover:text-accent transition-colors duration-200">Thần Số Học</a>
          <a href="#tarot" className="hover:text-accent transition-colors duration-200">Tarot</a>
          <a href="#" className="hover:text-accent transition-colors duration-200">Giới Thiệu</a>
          <a href="#" className="hover:text-accent transition-colors duration-200">Liên Hệ</a>
        </div>
        
        <button className="md:hidden text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
