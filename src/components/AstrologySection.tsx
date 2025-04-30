
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateAstrologyReading } from '@/utils/geminiApi';

type AstrologyFormData = {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
};

const AstrologySection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AstrologyFormData>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [astrologyReading, setAstrologyReading] = useState('');

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
    
    try {
      const reading = await generateAstrologyReading(
        formData.fullName,
        formData.birthDate,
        formData.birthTime,
        formData.birthPlace
      );
      
      setAstrologyReading(reading);
      setShowResult(true);
      
      // Scroll to results after a brief delay
      setTimeout(() => {
        const resultsElement = document.getElementById('astrology-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating astrology reading:', error);
      toast({
        title: "Không thể tạo kết quả",
        description: "Đã xảy ra lỗi khi tạo lá số tử vi. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowResult(false);
    setAstrologyReading('');
  };

  // Function to render the reading in a formatted way
  const renderFormattedReading = () => {
    if (!astrologyReading) return null;
    
    // Split the text into paragraphs
    const paragraphs = astrologyReading.split('\n\n').filter(p => p.trim());
    
    return (
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => {
          if (paragraph.includes('Cung mệnh') || paragraph.includes('CUNG MỆNH')) {
            return (
              <div key={index} className="p-6 border border-purple-800/30 rounded-lg bg-card/50">
                <h5 className="text-lg font-serif text-primary mb-3">Cung Mệnh</h5>
                <p>{paragraph}</p>
              </div>
            );
          } else if (paragraph.includes('Cung thân') || paragraph.includes('CUNG THÂN')) {
            return (
              <div key={index} className="p-6 border border-purple-800/30 rounded-lg bg-card/50">
                <h5 className="text-lg font-serif text-primary mb-3">Cung Thân</h5>
                <p>{paragraph}</p>
              </div>
            );
          } else if (paragraph.includes('sao chính') || paragraph.includes('SAO CHÍNH')) {
            return (
              <div key={index} className="p-6 border border-purple-800/30 rounded-lg bg-card/50">
                <h5 className="text-lg font-serif text-primary mb-3">Các Sao Chính</h5>
                <p>{paragraph}</p>
              </div>
            );
          } else if (paragraph.includes('Vận mệnh') || paragraph.includes('VẬN MỆNH')) {
            return (
              <div key={index} className="p-6 border border-purple-800/30 rounded-lg bg-card/50">
                <h5 className="text-lg font-serif text-primary mb-3">Vận Mệnh Tổng Quan</h5>
                <p>{paragraph}</p>
              </div>
            );
          } else {
            return (
              <div key={index} className="p-6 border border-purple-800/30 rounded-lg bg-card/50">
                <p>{paragraph}</p>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif text-primary">Tử Vi</h3>
        <p className="text-muted-foreground">
          Khám phá lá số tử vi của bạn dựa trên thời gian và địa điểm sinh
        </p>
      </div>
      
      {!showResult ? (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
              Họ và Tên đầy đủ
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
          
          <div>
            <label htmlFor="birthTime" className="block text-sm font-medium text-foreground mb-1">
              Giờ Sinh (nếu biết)
            </label>
            <input
              type="time"
              id="birthTime"
              name="birthTime"
              className="mystical-input"
              value={formData.birthTime}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="birthPlace" className="block text-sm font-medium text-foreground mb-1">
              Nơi Sinh
            </label>
            <input
              type="text"
              id="birthPlace"
              name="birthPlace"
              className="mystical-input"
              placeholder="Nhập địa điểm nơi bạn sinh ra"
              value={formData.birthPlace}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="text-center mt-8">
            <Button 
              type="submit"
              className="mystical-button"
              disabled={loading}
            >
              {loading ? "Đang Xử Lý..." : "Xem Kết Quả Tử Vi"}
            </Button>
          </div>
        </form>
      ) : (
        <div id="astrology-results" className="space-y-8 animate-fade-in-up">
          <div className="text-center">
            <h4 className="text-xl font-serif mb-2">Kết Quả Tử Vi Của</h4>
            <h3 className="text-2xl font-serif text-accent mb-6">{formData.fullName}</h3>
            <p className="text-sm text-muted-foreground">
              Sinh ngày: {new Date(formData.birthDate).toLocaleDateString('vi-VN')}
              {formData.birthTime && ` vào lúc ${formData.birthTime}`}
              {formData.birthPlace && ` tại ${formData.birthPlace}`}
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

export default AstrologySection;
