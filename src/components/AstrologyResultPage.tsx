import React, { useState, useEffect } from 'react';
import AstrologyDisplay from './AstrologyDisplay';
import { BasicAstrologyJsonResponse, DetailedAstrologyJsonResponse } from '@/types/astrology';
import { generateAstrologyReading, generateAstrologyDetailedReading } from '@/services/api/astrologyService';

// Component hiển thị kết quả tử vi (dùng khi không qua context)
const AstrologyResultPage: React.FC<{
  name: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  isDetailed?: boolean;
}> = ({ name, birthDate, birthTime, birthPlace, isDetailed = false }) => {
  // State để lưu dữ liệu, trạng thái loading và lỗi
  const [readingData, setReadingData] = useState<BasicAstrologyJsonResponse | DetailedAstrologyJsonResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReading = async () => {
      setIsLoading(true);
      setError(null);
      setReadingData(null);

      try {
        let jsonString;
        if (isDetailed) {
          jsonString = await generateAstrologyDetailedReading(name, birthDate, birthTime, birthPlace);
        } else {
          jsonString = await generateAstrologyReading(name, birthDate, birthTime, birthPlace);
        }

        // Parse JSON an toàn
        try {
          const parsedData = JSON.parse(jsonString);

          if (typeof parsedData === 'object' && parsedData !== null && Object.keys(parsedData).length > 0) {
            setReadingData(parsedData);
          } else {
            console.error("Parsed data is not a valid object or is empty.");
            // Lỗi này có thể do API trả về JSON rỗng "{}" hoặc không đúng cấu trúc
            setError("Dữ liệu trả về không hợp lệ hoặc rỗng.");
          }
        } catch (parseError) {
          console.error("Lỗi parse JSON:", parseError);
          console.error("Chuỗi JSON gốc (hoặc fallback text):", jsonString.substring(0, 200) + '...');
          // Lỗi này xảy ra nếu API trả về fallback text hoặc JSON không hợp lệ
          setError("Định dạng dữ liệu trả về không hợp lệ. Không thể đọc được kết quả phân tích.");
          // Quan trọng: Không setReadingData nếu parse lỗi
        }
      } catch (apiError: any) {
        console.error("Lỗi gọi API tử vi:", apiError);
        setError(apiError.message || "Không thể lấy được phân tích tử vi. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (name && birthDate) {
      fetchReading();
    } else {
      setError("Vui lòng cung cấp đầy đủ họ tên và ngày sinh.");
      setIsLoading(false);
    }
  }, [name, birthDate, birthTime, birthPlace, isDetailed]);

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <h1 className="text-2xl md:text-3xl font-serif text-center text-primary mb-6">
          Kết quả Phân Tích Tử Vi {isDetailed ? "Chi Tiết" : "Cơ Bản"}
        </h1>
        
        {/* Thông tin người dùng */}
        <div className="bg-card border border-border/60 rounded-lg p-4 md:p-6 mb-8 max-w-xl mx-auto shadow-sm">
          <h2 className="text-lg font-medium mb-3 text-foreground border-b border-border/40 pb-2">Thông tin cá nhân</h2>
          <div className="space-y-2 text-muted-foreground">
            <p><span className="font-medium text-foreground mr-2">Họ tên:</span>{name}</p>
            <p><span className="font-medium text-foreground mr-2">Ngày sinh:</span>{birthDate}</p>
            {birthTime && <p><span className="font-medium text-foreground mr-2">Giờ sinh:</span>{birthTime}</p>}
            {birthPlace && <p><span className="font-medium text-foreground mr-2">Nơi sinh:</span>{birthPlace}</p>}
          </div>
        </div>
        
        {/* Hiển thị kết quả */}
        <AstrologyDisplay
          readingData={readingData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default AstrologyResultPage; 