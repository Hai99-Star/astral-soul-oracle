
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type NumerologyFormData = {
  fullName: string;
  birthDate: string;
};

const calculateLifePathNumber = (date: string): number => {
  // Simple calculation for demo purposes
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
  const [lifePathNumber, setLifePathNumber] = useState(0);

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
    
    const number = calculateLifePathNumber(formData.birthDate);
    setLifePathNumber(number);
    setShowResult(true);
    
    // Scroll to results after a brief delay
    setTimeout(() => {
      const resultsElement = document.getElementById('numerology-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const resetForm = () => {
    setShowResult(false);
  };

  const getLifePathDescription = (num: number): string => {
    const descriptions: {[key: number]: string} = {
      1: "Bạn là người có tính cách độc lập, tự tin và có khả năng lãnh đạo. Bạn thường tiên phong trong các ý tưởng mới và có khả năng thuyết phục cao.",
      2: "Bạn rất nhạy cảm, trực giác và có khả năng hòa giải. Bạn làm việc tốt trong các môi trường đòi hỏi sự hợp tác và khả năng lắng nghe.",
      3: "Bạn là người sáng tạo, giàu trí tưởng tượng và có khả năng giao tiếp tốt. Bạn thường thu hút mọi người bằng sự nhiệt tình và lạc quan.",
      4: "Bạn là người thực tế, đáng tin cậy và có tính tổ chức cao. Bạn đặt nền móng vững chắc cho mọi dự án và luôn hoàn thành cam kết.",
      5: "Bạn yêu tự do, thích khám phá và thay đổi. Bạn thích trải nghiệm đa dạng và có khả năng thích nghi cao với môi trường mới.",
      6: "Bạn là người có trách nhiệm, giàu lòng trắc ẩn và luôn quan tâm đến người khác. Bạn có khả năng chăm sóc và nuôi dưỡng mọi người xung quanh.",
      7: "Bạn có tư duy phân tích sâu sắc và trực giác mạnh mẽ. Bạn thường đặt câu hỏi và tìm kiếm ý nghĩa sâu xa của mọi sự việc.",
      8: "Bạn có tham vọng, tính kỷ luật cao và khả năng quản lý tốt. Bạn có tiềm năng đạt được thành công và sự thịnh vượng trong sự nghiệp.",
      9: "Bạn có lòng nhân ái, tinh thần phục vụ và tầm nhìn rộng lớn. Bạn thường đặt lợi ích của cộng đồng lên trên lợi ích cá nhân."
    };
    
    return descriptions[num] || "Đường đời của bạn là con số đặc biệt, mang nhiều ý nghĩa sâu xa và cần được giải mã cụ thể hơn.";
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
          
          <div className="text-center mt-8">
            <Button 
              type="submit"
              className="mystical-button"
              style={{ background: "linear-gradient(to right, rgb(254,202,87), rgb(252,176,69))" }}
            >
              Xem Kết Quả Thần Số Học
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
          
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
              <span className="text-5xl font-serif text-accent">{lifePathNumber}</span>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="font-serif text-xl mb-2">Con Số Đường Đời</h4>
            <p className="max-w-2xl mx-auto">
              {getLifePathDescription(lifePathNumber)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-6 border border-accent/30 rounded-lg bg-card/50">
              <h5 className="text-lg font-serif text-accent mb-3">Con Số Linh Hồn</h5>
              <div className="text-4xl font-serif text-accent text-center mb-3">4</div>
              <p className="text-sm">
                Thể hiện khát vọng và mong muốn nội tâm. Với con số 4, bạn khao khát sự ổn định, 
                hệ thống và nền tảng vững chắc trong cuộc sống.
              </p>
            </div>
            
            <div className="p-6 border border-accent/30 rounded-lg bg-card/50">
              <h5 className="text-lg font-serif text-accent mb-3">Con Số Sứ Mệnh</h5>
              <div className="text-4xl font-serif text-accent text-center mb-3">2</div>
              <p className="text-sm">
                Đại diện cho điểm đến của bạn trong đời. Với con số 2, sứ mệnh của bạn là mang lại 
                hòa bình, cân bằng và hợp tác cho thế giới xung quanh.
              </p>
            </div>
            
            <div className="p-6 border border-accent/30 rounded-lg bg-card/50">
              <h5 className="text-lg font-serif text-accent mb-3">Con Số Nhân Cách</h5>
              <div className="text-4xl font-serif text-accent text-center mb-3">6</div>
              <p className="text-sm">
                Phản ánh cách người khác nhìn nhận về bạn. Với con số 6, bạn được xem là người đáng 
                tin cậy, có trách nhiệm và luôn quan tâm đến người khác.
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

export default NumerologySection;
