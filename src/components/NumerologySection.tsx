
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateNumerologyReading } from '@/utils/geminiApi';

type NumerologyFormData = {
  fullName: string;
  birthDate: string;
};

// Simple calculation for display purposes while waiting for API response
const calculateLifePathNumber = (date: string): number => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  
  // Sum all digits
  const sum = (day + month + 
               parseInt(year.toString()[0]) + 
               parseInt(year.toString()[1]) +
               parseInt(year.toString()[2]) +
               parseInt(year.toString()[3]));
  
  // Reduce to a single digit
  let result = sum;
  while (result > 9) {
    result = Math.floor(result / 10) + (result % 10);
  }
  
  return result;
};

const NumerologySection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NumerologyFormData>({
    fullName: '',
    birthDate: '',
  });
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lifePathNumber, setLifePathNumber] = useState(0);
  const [numerologyReading, setNumerologyReading] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.birthDate) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng nhập đầy đủ tên và ngày sinh của bạn.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    const number = calculateLifePathNumber(formData.birthDate);
    setLifePathNumber(number);
    
    try {
      const reading = await generateNumerologyReading(
        formData.fullName,
        formData.birthDate
      );
      
      setNumerologyReading(reading);
      setShowResult(true);
      
      // Scroll to results after a brief delay
      setTimeout(() => {
        const resultsElement = document.getElementById('numerology-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating numerology reading:', error);
      toast({
        title: "Không thể tạo kết quả",
        description: "Đã xảy ra lỗi khi tạo thần số học. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowResult(false);
    setNumerologyReading('');
  };

  // Function to render the reading in a formatted way
  const renderFormattedReading = () => {
    if (!numerologyReading) return null;
    
    // Split the text into paragraphs
    const paragraphs = numerologyReading.split('\n\n').filter(p => p.trim());
    
    // Try to extract numbers for display
    let soulNumber = 4; // Default fallback values
    let destinyNumber = 2;
    let personalityNumber = 6;
    
    // Extract potential numbers from the text (this is a simple approach)
    paragraphs.forEach(paragraph => {
      if (paragraph.includes('linh hồn') || paragraph.includes('LINH HỒN')) {
        const match = paragraph.match(/\b[1-9]\b/);
        if (match) soulNumber = parseInt(match[0]);
      }
      if (paragraph.includes('sứ mệnh') || paragraph.includes('SỨ MỆNH')) {
        const match = paragraph.match(/\b[1-9]\b/);
        if (match) destinyNumber = parseInt(match[0]);
      }
      if (paragraph.includes('nhân cách') || paragraph.includes('NHÂN CÁCH')) {
        const match = paragraph.match(/\b[1-9]\b/);
        if (match) personalityNumber = parseInt(match[0]);
      }
    });
    
    return (
      <>
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
            <span className="text-5xl font-serif text-accent">{lifePathNumber}</span>
          </div>
        </div>
        
        <div className="text-center">
          <h4 className="font-serif text-xl mb-2">Con Số Đường Đời</h4>
          {paragraphs.map((paragraph, index) => {
            if (paragraph.toLowerCase().includes('đường đời') || paragraph.toLowerCase().includes('con số chủ đạo')) {
              return <p key={index} className="max-w-2xl mx-auto">{paragraph}</p>;
            }
            return null;
          })}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-6 border border-accent/30 rounded-lg bg-card/50">
            <h5 className="text-lg font-serif text-accent mb-3">Con Số Linh Hồn</h5>
            <div className="text-4xl font-serif text-accent text-center mb-3">{soulNumber}</div>
            {paragraphs.map((paragraph, index) => {
              if (paragraph.toLowerCase().includes('linh hồn')) {
                return <p key={index} className="text-sm">{paragraph}</p>;
              }
              return null;
            })}
          </div>
          
          <div className="p-6 border border-accent/30 rounded-lg bg-card/50">
            <h5 className="text-lg font-serif text-accent mb-3">Con Số Sứ Mệnh</h5>
            <div className="text-4xl font-serif text-accent text-center mb-3">{destinyNumber}</div>
            {paragraphs.map((paragraph, index) => {
              if (paragraph.toLowerCase().includes('sứ mệnh')) {
                return <p key={index} className="text-sm">{paragraph}</p>;
              }
              return null;
            })}
          </div>
          
          <div className="p-6 border border-accent/30 rounded-lg bg-card/50">
            <h5 className="text-lg font-serif text-accent mb-3">Con Số Nhân Cách</h5>
            <div className="text-4xl font-serif text-accent text-center mb-3">{personalityNumber}</div>
            {paragraphs.map((paragraph, index) => {
              if (paragraph.toLowerCase().includes('nhân cách')) {
                return <p key={index} className="text-sm">{paragraph}</p>;
              }
              return null;
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif text-accent">Thần Số Học</h3>
        <p className="text-muted-foreground">
          Khám phá các con số định mệnh và ý nghĩa sâu xa của chúng trong cuộc đời bạn
        </p>
      </div>
      
      {!showResult ? (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
              Họ và Tên đầy đủ (theo giấy tờ)
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="mystical-input"
              placeholder="Nhập họ và tên đầy đủ của bạn"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-foreground mb-1">
              Ngày Tháng Năm Sinh
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              className="mystical-input"
              value={formData.birthDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="text-center mt-8">
            <Button 
              type="submit"
              className="mystical-button"
              style={{ background: "linear-gradient(to right, rgb(254,202,87), rgb(252,176,69))" }}
              disabled={loading}
            >
              {loading ? "Đang Xử Lý..." : "Xem Kết Quả Thần Số Học"}
            </Button>
          </div>
        </form>
      ) : (
        <div id="numerology-results" className="space-y-8 animate-fade-in-up">
          <div className="text-center">
            <h4 className="text-xl font-serif mb-2">Kết Quả Thần Số Học Của</h4>
            <h3 className="text-2xl font-serif text-accent mb-6">{formData.fullName}</h3>
            <p className="text-sm text-muted-foreground">
              Sinh ngày: {new Date(formData.birthDate).toLocaleDateString('vi-VN')}
            </p>
          </div>
          
          {renderFormattedReading()}
          
          <div className="text-center mt-8">
            <Button 
              type="button"
              className="bg-muted/80 text-foreground hover:bg-muted/60 px-6 py-3 rounded-md"
              onClick={resetForm}
            >
              Nhập Thông Tin Mới
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NumerologySection;
