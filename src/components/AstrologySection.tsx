import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import AstrologyIcon from './AstrologyIcon';
import { useAstrology } from '@/contexts/AstrologyContext';
import AstrologyForm from './AstrologyForm';
import AstrologyDisplay from './AstrologyDisplay';
import { BasicAstrologyJsonResponse, DetailedAstrologyJsonResponse } from '@/types/astrology';
import { AstrologyErrorType } from '@/contexts/types';

const AstrologySection = () => {
  const { 
    state, 
    updateFormData, 
    generateReading, 
    resetForm, 
    toggleDetailedReading 
  } = useAstrology();
  
  const { 
    formData, 
    isLoading, 
    showResult, 
    reading: astrologyReadingString, 
    useDetailedReading,
    error
  } = state;

  const [parsedReadingData, setParsedReadingData] = useState<BasicAstrologyJsonResponse | DetailedAstrologyJsonResponse | null>(null);
  const [parsingError, setParsingError] = useState<string | null>(null);

  // Cập nhật lỗi parse từ context error nếu có
  useEffect(() => {
    if (error.type === AstrologyErrorType.PARSING_ERROR) {
      setParsingError(error.message);
    } else if (error.type === AstrologyErrorType.NONE) {
      setParsingError(null);
    }
  }, [error]);

  useEffect(() => {
    // Xóa dữ liệu khi loading bắt đầu
    if (isLoading) {
      setParsedReadingData(null);
      return;
    }

    if (showResult && astrologyReadingString) {
      const trimmedString = astrologyReadingString.trim();
      if (!trimmedString.startsWith('{') && !trimmedString.startsWith('[')) {
        console.error("[AstrologySection] Received non-JSON response:", trimmedString.substring(0, 100));
        setParsingError("API không trả về định dạng dữ liệu JSON. Vui lòng thử lại sau.");
        setParsedReadingData(null);
        return;
      }
      
      try {
        const parsedData = JSON.parse(astrologyReadingString);

        if (typeof parsedData === 'object' && parsedData !== null && Object.keys(parsedData).length > 0) {
          setParsedReadingData(parsedData);
          setParsingError(null);
        } else {
          console.error("[AstrologySection] Parsed data is not a valid object or is empty.");
          setParsingError("Dữ liệu trả về không hợp lệ hoặc rỗng.");
          setParsedReadingData(null);
        }
      } catch (error) {
        console.error("[AstrologySection] Failed to parse astrology reading JSON:", error);
        console.error("[AstrologySection] Original string:", astrologyReadingString.substring(0, 200));
        setParsingError("Định dạng dữ liệu trả về không hợp lệ. Không thể đọc được kết quả phân tích.");
        setParsedReadingData(null);
      }
    } else if (!showResult) {
      setParsedReadingData(null);
      setParsingError(null);
    }
  }, [showResult, astrologyReadingString, isLoading]);

  const handleFormSubmit = async (data: typeof formData, isDetailed: boolean) => {
    // Xóa dữ liệu cũ trước khi gửi yêu cầu mới
    setParsedReadingData(null);
    setParsingError(null);
    
    console.log("[AstrologySection] handleFormSubmit - Submitting form data:", data);
    
    // Cập nhật form data
    updateFormData(data);
    
    // Chuyển chế độ đọc nếu cần
    if (isDetailed !== useDetailedReading) {
      toggleDetailedReading();
    }
    
    // Gửi yêu cầu đọc dữ liệu trực tiếp với data
    await generateReading(data);
  };

  // Kiểm tra nếu có lỗi validation form - đặc biệt quan tâm đến lỗi này
  const hasFormValidationError = error.type === AstrologyErrorType.FORM_VALIDATION;

  return (
    <div>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <AstrologyIcon className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-2xl font-serif text-primary">Tử Vi</h3>
        <p className="text-muted-foreground">
          Khám phá lá số tử vi của bạn dựa trên thời gian và địa điểm sinh
        </p>
      </div>
      
      {/* Hiển thị lỗi form validation */}
      {hasFormValidationError && !showResult && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
          {error.message}
        </div>
      )}
      
      {!showResult ? (
        <AstrologyForm
          initialData={formData}
          isLoading={isLoading}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <div id="astrology-results" className="mt-6">
          {/* Hiển thị lỗi API nếu có */}
          {error.type === AstrologyErrorType.API_ERROR && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
              {error.message}
            </div>
          )}
          
          <AstrologyDisplay
            error={parsingError}
            isLoading={isLoading}
            readingData={parsedReadingData}
          />
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => {
                // Xóa state trước khi reset form
                setParsedReadingData(null);
                setParsingError(null);
                resetForm();
              }}
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
            >
              Quay lại nhập thông tin
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AstrologySection;
