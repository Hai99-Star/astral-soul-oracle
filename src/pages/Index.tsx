
import React from 'react';
import NavBar from '@/components/NavBar';
import Hero from '@/components/Hero';
import DivinationForm from '@/components/DivinationForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <Hero />
      <DivinationForm />
      
      <footer className="py-10 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Astral Soul Oracle. Khám phá vận mệnh qua Tử Vi, Thần Số Học và Tarot.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
