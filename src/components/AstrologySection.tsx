
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.birthDate) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng nhập đầy đủ tên và ngày sinh của bạn.",
        variant: "destructive"
      });
      return;
    }
    
    setShowResult(true);
    
    // Scroll to results after a brief delay
    setTimeout(() => {
      const resultsElement = document.getElementById('astrology-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const resetForm = () => {
    setShowResult(false);
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
            />
          </div>
          
          <div className="text-center mt-8">
            <Button 
              type="submit"
              className="mystical-button"
            >
              Xem Kết Quả Tử Vi
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-purple-800/30 rounded-lg bg-card/50">
              <h5 className="text-lg font-serif text-primary mb-3">Cung Mệnh</h5>
              <p>
                Cung mệnh của bạn là <span className="text-accent">Thiên Bình</span>. Bạn có tính cách cân bằng, 
                khéo léo trong giao tiếp và có khả năng nhìn nhận mọi vấn đề từ nhiều góc độ khác nhau.
              </p>
            </div>
            
            <div className="p-6 border border-purple-800/30 rounded-lg bg-card/50">
              <h5 className="text-lg font-serif text-primary mb-3">Cung Thân</h5>
              <p>
                Cung thân của bạn nằm ở <span className="text-accent">Bạch Dương</span>, thể hiện năng lượng mạnh mẽ, 
                quyết đoán và khả năng tiên phong trong nhiều tình huống.
              </p>
            </div>
            
            <div className="p-6 border border-purple-800/30 rounded-lg bg-card/50">
              <h5 className="text-lg font-serif text-primary mb-3">Các Sao Chính</h5>
              <ul className="space-y-2">
                <li>
                  <span className="text-accent">Tử Vi:</span> Ở vị trí tốt, mang lại tài năng lãnh đạo và khả năng tổ chức
                </li>
                <li>
                  <span className="text-accent">Thiên Phủ:</span> Mang lại sự ổn định tài chính và khả năng tích lũy
                </li>
                <li>
                  <span className="text-accent">Thái Dương:</span> Giúp bạn tỏa sáng, tạo uy tín trong sự nghiệp
                </li>
              </ul>
            </div>
            
            <div className="p-6 border border-purple-800/30 rounded-lg bg-card/50">
              <h5 className="text-lg font-serif text-primary mb-3">Vận Mệnh Tổng Quan</h5>
              <p>
                Với cung mệnh và các sao chiếu mạng, đường đời của bạn sẽ có nhiều cơ hội phát triển về mặt sự nghiệp, 
                đặc biệt trong các lĩnh vực đòi hỏi khả năng giao tiếp và tư duy phân tích. 
                Giai đoạn 30-35 tuổi là thời kỳ vàng cho sự nghiệp của bạn.
              </p>
            </div>
          </div>
          
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
