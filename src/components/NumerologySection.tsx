import React from 'react';
import { Button } from '@/components/ui/button';
import AstrologyIcon from './AstrologyIcon';
import { useNumerology } from '@/contexts/NumerologyContext';
import NumerologyDetailedView from './NumerologyDetailedView';

const NumerologySection = () => {
  const { state, updateFormData, generateReading, resetForm } = useNumerology();
  
  const { 
    formData, 
    isLoading: loading, 
    showResult, 
    reading: numerologyReading,
    lifePathNumber
  } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateReading();
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
        <div className="flex justify-center mb-4">
          <AstrologyIcon className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-2xl font-serif text-accent">Thần Số Học</h3>
        <p className="text-muted-foreground">
          Khám phá các con số vận mệnh của bạn và ý nghĩa của chúng
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
            <p className="text-xs text-muted-foreground mt-1">Vui lòng nhập tên đầy đủ và chính xác để có kết quả chính xác nhất</p>
          </div>
          
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-foreground mb-1">
              Ngày Tháng Năm Sinh
            </label>
            <input
              type="text" 
              id="birthDate"
              name="birthDate"
              className="mystical-input"
              placeholder="DD/MM/YYYY - Ví dụ: 15/08/1990"
              value={formData.birthDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">Định dạng: DD/MM/YYYY (ngày/tháng/năm)</p>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              type="submit" 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-white font-medium px-8"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="mr-2">Đang phân tích...</span>
                  <div className="h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full animate-spin"></div>
                </>
              ) : (
                'Xem Thần Số Học'
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div id="numerology-results" className="mt-6">
          {/* Kiểm tra xem dữ liệu có phải JSON không */}
          {numerologyReading && (
            <>
              {(() => {
                try {
                  // Nếu dữ liệu có thể parse thành JSON, hiển thị NumerologyDetailedView
                  JSON.parse(numerologyReading);
                  return <NumerologyDetailedView />;
                } catch {
                  // Nếu không phải JSON, hiển thị định dạng cũ
                  return (
                    <div className="space-y-8">
                      {renderFormattedReading()}
                      <div className="flex justify-center mt-8">
                        <Button 
                          onClick={resetForm} 
                          variant="outline" 
                          className="border-accent text-accent hover:bg-accent/10"
                        >
                          Quay lại nhập thông tin
                        </Button>
                      </div>
                    </div>
                  );
                }
              })()}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NumerologySection;
