import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TAROT_CARDS } from '@/constants/tarotCards';

interface TarotReadingProps {
  reading: string;
  question: string;
  selectedCards: number[];
  onReset: () => void;
}

/**
 * Component hiển thị kết quả đọc bài Tarot
 */
const TarotReading: React.FC<TarotReadingProps> = ({
  reading,
  question,
  selectedCards,
  onReset
}) => {
  // Handle asterisks as line breaks and emphasize keywords between asterisks
  const formatTextWithAsterisks = (text: string): React.ReactNode => {
    // First, process double asterisks for important keywords
    const processedText = text.replace(/\*\*(.*?)\*\*/g, (_, match) => {
      return `__KEYWORD_START__${match}__KEYWORD_END__`;
    });
    
    // Split by single asterisks
    const segments = processedText.split(/\*/g);
    
    if (segments.length <= 1) {
      // No single asterisks found, render with keyword spans
      return processKeywords(text);
    }
    
    // If we have segments separated by single asterisks, convert them to line breaks
    return segments.map((segment, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {processKeywords(segment)}
      </React.Fragment>
    ));
  };
  
  // Process keywords wrapped in double asterisks
  const processKeywords = (text: string): React.ReactNode => {
    // Replace double asterisks with spans for styling
    const parts = text.split(/(__KEYWORD_START__|__KEYWORD_END__)/g).filter(Boolean);
    
    if (parts.length <= 1) {
      // No special markers, just return the text
      return text.replace(/\*\*(.*?)\*\*/g, '$1');
    }
    
    let isKeyword = false;
    return parts.map((part, i) => {
      if (part === '__KEYWORD_START__') {
        isKeyword = true;
        return null;
      } else if (part === '__KEYWORD_END__') {
        isKeyword = false;
        return null;
      } else if (isKeyword) {
        return <span key={i} className="keyword">{part}</span>;
      } else {
        return part;
      }
    });
  };

  // Function to find the title section (usually first paragraph with # or ##)
  const findTitle = (paragraphs: string[]) => {
    const titleParagraph = paragraphs.find(p => p.startsWith('# ') || p.startsWith('## '));
    if (titleParagraph) {
      return titleParagraph.replace(/^#+ /, '');
    }
    return "Kết Quả Đọc Bài Tarot";
  };

  // Process headings and make them more visually distinct
  const processHeading = (text: string, level: number): React.ReactNode => {
    // Remove heading markers and extract the text
    const headingText = text.replace(/^#+\s+/, '');
    
    if (level === 2) {
      return (
        <div className="mt-10 section-appear">
          <h4 className="text-xl font-serif text-purple-300 mb-4 border-b border-purple-500/20 pb-2 font-bold">
            {headingText}
          </h4>
        </div>
      );
    } else if (level === 3) {
      return (
        <div className="mt-6 section-appear">
          <h5 className="text-lg font-serif text-purple-200 mb-3 font-semibold">
            {headingText}
          </h5>
        </div>
      );
    }
    
    return headingText;
  };

  // Add scroll into view effect
  useEffect(() => {
    const element = document.getElementById('tarot-reading');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  if (!reading) return null;
  
  // Split the text into paragraphs
  const paragraphs = reading.split('\n\n').filter(p => p.trim());
  
  return (
    <div id="tarot-reading" className="animate-fade-in max-w-5xl mx-auto">
      <div className="space-y-8">
        <h3 className="text-3xl font-serif text-secondary text-center mb-8 animate-fade-in-down font-bold text-purple-300">
          {findTitle(paragraphs)}
        </h3>
        
        {/* Question Section */}
        <div className="p-6 border border-secondary/30 rounded-lg bg-card/50 shadow-inner animate-fade-in-up animation-delay-200">
          <h4 className="text-lg font-serif text-secondary mb-3 font-semibold text-purple-200">Câu Hỏi Của Bạn</h4>
          <p className="italic text-purple-100">"{question}"</p>
        </div>
        
        {/* Cards Section - Display the selected cards images with improved styling */}
        <div className="my-12 animate-fade-in-up animation-delay-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {selectedCards.map((cardIndex, i) => (
              <div key={i} className={`flex flex-col items-center transform transition-all duration-700 hover:scale-105 card-appear-${i}`} 
                   style={{animationDelay: `${i * 300}ms`}}>
                <div className="relative mb-4 group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20 rounded-lg 
                                 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <img 
                    src={TAROT_CARDS[cardIndex].image} 
                    alt={TAROT_CARDS[cardIndex].name} 
                    className="w-48 h-auto rounded-lg border-2 border-secondary/40 shadow-xl 
                             transition-all duration-500 group-hover:shadow-glow" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-purple-900/30 
                               p-3 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                               backdrop-blur-sm">
                    <p className="text-white text-center font-medium">
                      {TAROT_CARDS[cardIndex].name}
                    </p>
                    <p className="text-white/80 text-center text-sm">
                      {TAROT_CARDS[cardIndex].nameVi}
                    </p>
                  </div>
                </div>
                <p className="text-md text-secondary font-semibold text-purple-300">
                  {TAROT_CARDS[cardIndex].name}
                </p>
                <p className="text-sm text-secondary/80 text-purple-200">
                  {TAROT_CARDS[cardIndex].nameVi}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Display other paragraphs as sections with animation */}
        <div className="space-y-6 animate-fade-in-up animation-delay-600">
          {paragraphs.map((paragraph, index) => {
            // Skip the first paragraph (title) and question paragraphs
            if (index === 0 || paragraph.includes('Câu hỏi') || paragraph.includes('câu hỏi của bạn')) {
              return null;
            }
            
            // Style headers differently
            if (paragraph.startsWith('## ')) {
              const headingLevel = paragraph.match(/^(#+)/)?.[0].length || 2;
              const headingContent = processHeading(paragraph, headingLevel);
              
              return (
                <div key={index} style={{animationDelay: `${index * 150}ms`}}>
                  {headingContent}
                </div>
              );
            } else if (paragraph.startsWith('### ')) {
              const headingLevel = paragraph.match(/^(#+)/)?.[0].length || 3;
              const headingContent = processHeading(paragraph, headingLevel);
              
              return (
                <div key={index} style={{animationDelay: `${index * 150}ms`}}>
                  {headingContent}
                </div>
              );
            } else if (paragraph.startsWith('# ')) {
              return null; // Skip main title, already displayed
            } else {
              // Regular paragraph with formatting for asterisks
              return (
                <div key={index} className="p-6 border border-secondary/30 rounded-lg bg-card/50 shadow-md 
                                          hover:shadow-lg transition-shadow duration-300 section-appear tarot-content" 
                     style={{animationDelay: `${index * 150}ms`}}>
                  <p className="leading-relaxed text-purple-50">
                    {formatTextWithAsterisks(paragraph)}
                  </p>
                </div>
              );
            }
          })}
        </div>
      </div>
      
      <div className="flex justify-center mt-12 mb-8 animate-fade-in-up animation-delay-800">
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="border-secondary text-secondary hover:bg-secondary/10 px-8 py-6 text-lg
                   transition-all duration-300 hover:shadow-glow-sm"
        >
          Bắt đầu lại
        </Button>
      </div>
    </div>
  );
};

export default TarotReading; 