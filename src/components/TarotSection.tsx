import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';

const tarotCards = [
  {
    id: 1,
    name: "The Fool",
    nameVi: "Kẻ Khờ",
    image: "https://www.trustedtarot.com/img/cards/the-fool.png",
    meaning: "Sự khởi đầu mới, tinh thần phiêu lưu, tự do và không lo lắng về tương lai. Bạn đang đứng trước cơ hội mới và nên tiếp cận nó với tâm trí cởi mở.",
  },
  {
    id: 2,
    name: "The Magician",
    nameVi: "Nhà Ảo Thuật",
    image: "https://www.trustedtarot.com/img/cards/the-magician.png",
    meaning: "Sức mạnh ý chí, sự sáng tạo và khả năng biến ước mơ thành hiện thực. Bạn có tất cả công cụ cần thiết để thành công trong dự định của mình.",
  },
  {
    id: 3,
    name: "The High Priestess",
    nameVi: "Nữ Giáo Sĩ",
    image: "https://www.trustedtarot.com/img/cards/the-high-priestess.png",
    meaning: "Trực giác, sự thông thái nội tâm và tiềm thức. Hãy lắng nghe tiếng nói bên trong và tin tưởng vào trực giác của bạn trong thời gian này.",
  },
  {
    id: 4,
    name: "The Empress",
    nameVi: "Hoàng Hậu",
    image: "https://www.trustedtarot.com/img/cards/the-empress.png",
    meaning: "Sự phong phú, sáng tạo và nuôi dưỡng. Đây là thời điểm để chăm sóc bản thân và những người xung quanh, cũng như để các ý tưởng của bạn phát triển.",
  },
  {
    id: 5,
    name: "The Emperor",
    nameVi: "Hoàng Đế",
    image: "https://www.trustedtarot.com/img/cards/the-emperor.png",
    meaning: "Quyền lực, cấu trúc và sự ổn định. Bạn cần thiết lập trật tự và kỷ luật trong cuộc sống hoặc dự án hiện tại của mình.",
  },
  {
    id: 6,
    name: "The Lovers",
    nameVi: "Cặp Đôi Yêu Nhau",
    image: "https://www.trustedtarot.com/img/cards/the-lovers.png",
    meaning: "Tình yêu, mối quan hệ hòa hợp và sự lựa chọn. Bạn có thể đang đối mặt với một quyết định quan trọng liên quan đến trái tim mình.",
  },
  {
    id: 7,
    name: "The Chariot",
    nameVi: "Cỗ Xe",
    image: "https://www.trustedtarot.com/img/cards/the-chariot.png",
    meaning: "Quyết tâm, ý chí mạnh mẽ và chiến thắng. Với sự kiên trì và tập trung, bạn sẽ vượt qua mọi thử thách hiện tại.",
  },
  {
    id: 8,
    name: "Strength",
    nameVi: "Sức Mạnh",
    image: "https://www.trustedtarot.com/img/cards/strength.png",
    meaning: "Lòng can đảm, kiên nhẫn và sức mạnh nội tâm. Đây là lúc để thể hiện sự kiên cường và tự tin vào khả năng của bản thân.",
  },
  {
    id: 9,
    name: "The Hermit",
    nameVi: "Ẩn Sĩ",
    image: "https://www.trustedtarot.com/img/cards/the-hermit.png",
    meaning: "Sự tự vấn, chiêm nghiệm và tìm kiếm chân lý. Bạn cần thời gian một mình để suy ngẫm và khám phá mục đích sâu xa hơn.",
  },
];

const TarotSection = () => {
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [shuffling, setShuffling] = useState(false);
  const [readingComplete, setReadingComplete] = useState(false);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const startReading = () => {
    if (!question) {
      toast({
        title: "Vui lòng nhập câu hỏi",
        description: "Hãy nhập câu hỏi hoặc điều bạn muốn tìm hiểu qua lá bài Tarot.",
        variant: "destructive"
      });
      return;
    }
    
    setShuffling(true);
    setSelectedCards([]);
    setRevealedCards([]);
    setReadingComplete(false);
    
    // Simulate card shuffling
    setTimeout(() => {
      const cardIndices = [];
      // Pick 3 random cards
      while (cardIndices.length < 3) {
        const randomIdx = Math.floor(Math.random() * tarotCards.length);
        if (!cardIndices.includes(randomIdx)) {
          cardIndices.push(randomIdx);
        }
      }
      setSelectedCards(cardIndices);
      setShuffling(false);
    }, 1500);
  };

  const revealCard = (index: number) => {
    if (!revealedCards.includes(index)) {
      setRevealedCards([...revealedCards, index]);
      
      // Check if all cards are revealed
      if (revealedCards.length + 1 === selectedCards.length) {
        setReadingComplete(true);
        
        // Scroll to reading interpretation
        setTimeout(() => {
          const resultsElement = document.getElementById('tarot-interpretation');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    }
  };

  const resetReading = () => {
    setSelectedCards([]);
    setRevealedCards([]);
    setReadingComplete(false);
    setQuestion('');
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif text-secondary">Tarot</h3>
        <p className="text-muted-foreground">
          Khám phá câu trả lời cho những điều bạn đang thắc mắc qua những lá bài Tarot cổ xưa
        </p>
      </div>
      
      {selectedCards.length === 0 && (
        <div className="max-w-xl mx-auto">
          <div className="mb-6">
            <label htmlFor="question" className="block text-sm font-medium text-foreground mb-1">
              Câu Hỏi Của Bạn
            </label>
            <input
              type="text"
              id="question"
              className="mystical-input"
              placeholder="Nhập câu hỏi hoặc điều bạn muốn tìm hiểu..."
              value={question}
              onChange={handleQuestionChange}
              disabled={shuffling}
            />
          </div>
          
          <div className="text-center mt-8">
            <Button 
              type="button"
              className="mystical-button"
              style={{ background: "linear-gradient(to right, rgb(88, 65, 150), rgb(120, 90, 200))" }}
              onClick={startReading}
              disabled={shuffling}
            >
              {shuffling ? "Đang Trải Bài..." : "Bắt Đầu Trải Bài"}
            </Button>
          </div>
        </div>
      )}
      
      {selectedCards.length > 0 && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <h4 className="text-lg font-serif mb-2">Trải Bài Tarot Cho Câu Hỏi</h4>
            <p className="text-accent font-medium italic">"{question}"</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {selectedCards.map((cardIndex, index) => {
              const isRevealed = revealedCards.includes(index);
              const card = tarotCards[cardIndex];
              
              return (
                <div key={index} className="flex justify-center">
                  <div 
                    className="relative w-48 h-80 rounded-lg cursor-pointer transition-transform duration-500 transform-gpu"
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: isRevealed ? 'rotateY(0deg)' : 'rotateY(180deg)'
                    }}
                    onClick={() => revealCard(index)}
                  >
                    <div 
                      className="absolute w-full h-full backface-hidden rounded-lg shadow-xl"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-lg">
                        <p className="text-white font-serif text-center">{card.nameVi}</p>
                      </div>
                    </div>
                    
                    <div 
                      className="absolute w-full h-full backface-hidden mystical-card flex items-center justify-center rounded-lg"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: "linear-gradient(135deg, #362a50 0%, #1e192d 100%)"
                      }}
                    >
                      <div className="text-center p-4">
                        <Star className="h-8 w-8 text-secondary mx-auto" />
                        <p className="text-secondary font-serif mt-2">Lá bài {index + 1}</p>
                        <p className="text-xs text-muted-foreground">Nhấn để lật</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {readingComplete && (
            <div id="tarot-interpretation" className="mt-12 mystical-card animate-fade-in-up">
              <h4 className="text-xl font-serif text-center mb-6">Diễn Giải Lá Bài</h4>
              
              <div className="space-y-6">
                {selectedCards.map((cardIndex, index) => {
                  const card = tarotCards[cardIndex];
                  return (
                    <div key={index} className="p-4 border border-secondary/30 rounded-lg">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3">
                          <span className="text-secondary font-medium">{index + 1}</span>
                        </div>
                        <h5 className="text-lg font-serif text-secondary">{card.nameVi} ({card.name})</h5>
                      </div>
                      <p>{card.meaning}</p>
                    </div>
                  );
                })}
                
                <div className="p-4 border border-primary/30 rounded-lg">
                  <h5 className="text-lg font-serif text-primary mb-3">Kết Luận</h5>
                  <p>
                    Dựa trên sự kết hợp của các lá bài, bạn đang trong giai đoạn cần sự cân nhắc kỹ lưỡng 
                    và lắng nghe trực giác. Những thử thách hiện tại đòi hỏi sự can đảm và kiên nhẫn, 
                    nhưng với quyết tâm và sự tập trung, bạn sẽ tìm thấy con đường phù hợp nhất cho mình.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  type="button"
                  className="bg-muted/80 text-foreground hover:bg-muted/60 px-6 py-3 rounded-md"
                  onClick={resetReading}
                >
                  Trải Bài Mới
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TarotSection;
