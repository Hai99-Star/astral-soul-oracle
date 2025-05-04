import React, { useEffect } from 'react';
import { Moon, Star } from 'lucide-react';
import AstrologyIcon from './AstrologyIcon';

// Function to create random stars
const createStars = () => {
  if (typeof document === 'undefined') return;

  const starsContainer = document.querySelector(".stars");
  if (!starsContainer) return;
  
  // Clear existing stars
  starsContainer.innerHTML = '';
  
  // Create new stars
  const starCount = 150;
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 2;
    
    // Random opacity and animation duration
    const opacity = Math.random() * 0.7 + 0.3;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 5;
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--opacity', opacity.toString());
    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);
    
    starsContainer.appendChild(star);
  }
};

const Hero = () => {
  useEffect(() => {
    createStars();
    window.addEventListener('resize', createStars);
    
    return () => {
      window.removeEventListener('resize', createStars);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      <div className="stars absolute inset-0"></div>
      
      {/* Animated orb */}
      <div className="absolute z-0 opacity-70">
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full animate-float">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-600/20 animate-pulse-glow"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-600/10 animate-pulse-glow" style={{ animationDelay: "-2s" }}></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500/5 to-blue-600/5 animate-pulse-glow" style={{ animationDelay: "-4s" }}></div>
          
          {/* Rotating ring */}
          <div className="absolute inset-[-30px] border border-purple-400/20 rounded-full animate-rotate-slow"></div>
          <div className="absolute inset-[-15px] border border-accent/20 rounded-full animate-rotate-slow" style={{ animationDirection: "reverse" }}></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <div className="mx-auto mb-6 w-20 h-20">
          <AstrologyIcon className="w-full h-full animate-pulse-glow" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif font-medium mb-6 leading-tight">
          <span className="text-foreground block">Giải Mã</span>
          <span className="text-primary block">Bí Ẩn Vận Mệnh</span>
          <span className="text-accent block">Ẩn Giấu Trong Bạn</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Nơi Vũ Trụ và Tâm Hồn Giao Thoa. Khám phá bản thân qua những vì sao, con số và lá bài thiêng liêng.
        </p>
        
        <a 
          href="#divination"
          className="mystical-button inline-flex items-center"
        >
          Khám Phá Ngay
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </a>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 opacity-90 hover:opacity-100 transition-opacity">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AstrologyIcon className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-serif mb-2">Tử Vi</h3>
            <p className="text-muted-foreground text-sm">
              Khám phá lá số tử vi và vận mệnh của bạn qua vị trí các vì sao
            </p>
          </div>
          
          <div className="p-4 opacity-90 hover:opacity-100 transition-opacity">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AstrologyIcon className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-serif mb-2">Thần Số Học</h3>
            <p className="text-muted-foreground text-sm">
              Giải mã con số đường đời, sứ mệnh và điểm mạnh tiềm ẩn
            </p>
          </div>
          
          <div className="p-4 opacity-90 hover:opacity-100 transition-opacity">
            <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AstrologyIcon className="h-16 w-16" />
            </div>
            <h3 className="text-xl font-serif mb-2">Tarot</h3>
            <p className="text-muted-foreground text-sm">
              Khám phá thông điệp từ các lá bài Tarot cổ xưa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
