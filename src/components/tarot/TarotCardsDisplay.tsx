import React from 'react';
import { Button } from '@/components/ui/button';
import { TAROT_CARDS } from '@/constants/tarotCards';
import { SPREAD_TYPES } from '@/types/tarot';
import TarotCard from './TarotCard';
import LoadingStar from './LoadingStar';

interface TarotCardsDisplayProps {
  selectedCards: number[];
  revealedCards: number[];
  onRevealCard: (index: number) => void;
  selectedCardCount: number;
  selectedSpreadType: string;
  onGenerateReading: () => void;
  isLoading: boolean;
}

/**
 * Component hiển thị các lá bài Tarot đã chọn
 */
const TarotCardsDisplay: React.FC<TarotCardsDisplayProps> = ({
  selectedCards,
  revealedCards,
  onRevealCard,
  selectedCardCount,
  selectedSpreadType,
  onGenerateReading,
  isLoading
}) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h4 className="font-serif text-2xl text-secondary mb-2 animate-fade-in-down">
          {selectedCardCount === 1 ? "Lá Bài Của Bạn" : "Các Lá Bài Của Bạn"}
        </h4>
        <p className="text-muted-foreground animate-fade-in opacity-0" style={{animationDelay: '0.3s'}}>
          {selectedCardCount === 1
            ? "Nhấp vào lá bài để lật lên và xem ý nghĩa"
            : "Nhấp vào từng lá bài để lật lên và xem ý nghĩa của chúng"}
        </p>
      </div>
      
      <div className={`grid ${selectedCardCount === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10'} max-w-3xl mx-auto perspective-1000`}>
        {selectedCards.map((cardIndex, i) => (
          <div 
            key={i} 
            className={`card-slot-${i} animate-card-appear opacity-0`} 
            style={{animationDelay: `${i * 300}ms`}}
          >
            <TarotCard
              cardIndex={cardIndex}
              position={i}
              isRevealed={revealedCards.includes(i)}
              onClick={() => onRevealCard(i)}
              cardImage={TAROT_CARDS[cardIndex].image}
              cardName={TAROT_CARDS[cardIndex].name}
              cardNameVi={TAROT_CARDS[cardIndex].nameVi}
            />
          </div>
        ))}
      </div>
      
      {selectedCardCount === 3 && (
        <div className="text-center mt-6 animate-fade-in opacity-0" style={{animationDelay: '1s'}}>
          <p className="text-secondary text-md">
            <span className="font-semibold">Loại Trải Bài:</span> {SPREAD_TYPES[selectedSpreadType]}
          </p>
        </div>
      )}
      
      {revealedCards.length === selectedCards.length && (
        <div 
          id="reading-button" 
          className="flex justify-center mt-10 animate-fade-in-up opacity-0" 
          style={{animationDelay: '0.5s'}}
        >
          <Button 
            onClick={onGenerateReading} 
            className="bg-secondary hover:bg-secondary/90 text-white font-medium px-8 py-4 text-lg
                     transition-all duration-500 hover:shadow-glow transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <span>Đang phân tích...</span>
                <div className="h-5 w-5 border-2 border-white border-opacity-50 border-t-white rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="relative overflow-hidden">
                <span className="relative z-10">Xem Kết Quả Đọc Bài</span>
                <div className="absolute inset-0 shimmer-effect"></div>
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TarotCardsDisplay; 