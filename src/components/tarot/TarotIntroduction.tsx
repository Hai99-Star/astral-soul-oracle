import React from 'react';
import LoadingStar from './LoadingStar';

interface TarotIntroductionProps {
  isLoading: boolean;
  introduction: string;
  selectCardCount: (count: number) => void;
}

/**
 * Component hiển thị giới thiệu về Tarot
 */
const TarotIntroduction: React.FC<TarotIntroductionProps> = ({
  isLoading,
  introduction,
  selectCardCount
}) => {
  // Remove Markdown asterisks from text
  const removeAsterisks = (text: string): string => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <LoadingStar text="Đang tải giới thiệu về Tarot..." />
      </div>
    );
  }
  
  // Split the introduction into paragraphs
  const paragraphs = introduction.split('\n\n').filter(p => p.trim());
  
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-serif text-center text-secondary mb-6">
        {paragraphs[0]?.replace(/^# /, '') || "Giới Thiệu Về Tarot"}
      </h3>
      
      <div className="prose prose-invert max-w-none">
        {paragraphs.slice(1).map((paragraph, index) => (
          <p key={index}>{removeAsterisks(paragraph)}</p>
        ))}
      </div>
      
      <div className="mt-12">
        <h4 className="text-xl font-serif text-center text-secondary mb-6">Bạn muốn lật mấy lá bài?</h4>
        
        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
          <button
            onClick={() => selectCardCount(1)}
            className="p-6 border-2 border-secondary/30 hover:border-secondary rounded-lg bg-card/50 hover:bg-card/70 transition-all duration-300"
          >
            <div className="text-4xl text-secondary font-serif mb-2">1</div>
            <p className="text-sm text-muted-foreground">Một lá bài - Thông điệp đơn giản, rõ ràng</p>
          </button>
          
          <button
            onClick={() => selectCardCount(3)}
            className="p-6 border-2 border-secondary/30 hover:border-secondary rounded-lg bg-card/50 hover:bg-card/70 transition-all duration-300"
          >
            <div className="text-4xl text-secondary font-serif mb-2">3</div>
            <p className="text-sm text-muted-foreground">Ba lá bài - Phân tích sâu sắc hơn</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TarotIntroduction; 