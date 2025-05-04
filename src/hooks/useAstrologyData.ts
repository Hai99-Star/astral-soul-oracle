import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { generateAstrologyReading, generateAstrologyDetailedReading } from '@/services/api/astrologyService';

export interface AstrologyFormValues {
  name: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
}

/**
 * Custom hook để quản lý dữ liệu tử vi và tương tác với API
 */
export function useAstrologyData() {
  const [loading, setLoading] = useState(false);
  const [basicReading, setBasicReading] = useState<string | null>(null);
  const [detailedReading, setDetailedReading] = useState<string | null>(null);
  const { handleError, executeWithErrorHandling } = useErrorHandler();

  /**
   * Lấy bản đọc tử vi cơ bản
   */
  const getBasicReading = useCallback(async (values: AstrologyFormValues) => {
    setLoading(true);
    
    const result = await executeWithErrorHandling(
      async () => {
        const jsonString = await generateAstrologyReading(
          values.name,
          values.birthDate,
          values.birthTime,
          values.birthPlace
        );
        
        // Log chuỗi nhận được để kiểm tra
        console.log('Raw response from basic reading:', jsonString.substring(0, 100) + '...');
        
        // Validate JSON format and check structure
        try {
          const parsedData = JSON.parse(jsonString);
          
          // Đảm bảo parsedData là object và không rỗng
          if (typeof parsedData === 'object' && parsedData !== null && Object.keys(parsedData).length > 0) {
            console.log('Successfully parsed basic reading JSON');
            return jsonString; // Giữ nguyên chuỗi JSON để các component khác có thể parse lại nếu cần
          } else {
            console.error('Parsed data is not a valid object or is empty.');
            throw new Error('Dữ liệu trả về không hợp lệ hoặc rỗng.');
          }
        } catch (parseError) {
          console.error('Error parsing JSON response from basic reading:', parseError);
          console.error('Raw response:', jsonString.substring(0, 200) + '...');
          throw new Error('Không thể đọc được kết quả phân tích. Định dạng dữ liệu không hợp lệ.');
        }
      },
      'Không thể tạo bản đọc tử vi',
      { formValues: values }
    );
    
    if (result) {
      setBasicReading(result);
    }
    
    setLoading(false);
    return result;
  }, [executeWithErrorHandling]);

  /**
   * Lấy bản đọc tử vi chi tiết
   */
  const getDetailedReading = useCallback(async (values: AstrologyFormValues) => {
    setLoading(true);
    
    const result = await executeWithErrorHandling(
      async () => {
        const jsonString = await generateAstrologyDetailedReading(
          values.name,
          values.birthDate,
          values.birthTime,
          values.birthPlace
        );
        
        // Log chuỗi nhận được để kiểm tra
        console.log('Raw response from detailed reading:', jsonString.substring(0, 100) + '...');
        
        // Validate JSON format and check structure
        try {
          const parsedData = JSON.parse(jsonString);
          
          // Đảm bảo parsedData là object và không rỗng
          if (typeof parsedData === 'object' && parsedData !== null && Object.keys(parsedData).length > 0) {
            // Kiểm tra thêm các trường bắt buộc cho phân tích chi tiết
            if (parsedData.gioiThieuChung && 
                parsedData.canChiVaLichAm && 
                parsedData.napAmAmDuongMang && 
                parsedData.vanMenhTongQuan) {
              console.log('Successfully parsed detailed reading JSON with all required fields');
              return jsonString; // Giữ nguyên chuỗi JSON để các component khác có thể parse lại nếu cần
            } else {
              console.error('Parsed data is missing required fields for detailed reading');
              throw new Error('Dữ liệu trả về thiếu các trường bắt buộc cho phân tích chi tiết.');
            }
          } else {
            console.error('Parsed data is not a valid object or is empty.');
            throw new Error('Dữ liệu trả về không hợp lệ hoặc rỗng.');
          }
        } catch (parseError) {
          console.error('Error parsing JSON response from detailed reading:', parseError);
          console.error('Raw response:', jsonString.substring(0, 200) + '...');
          throw new Error('Không thể đọc được kết quả phân tích chi tiết. Định dạng dữ liệu không hợp lệ.');
        }
      },
      'Không thể tạo bản đọc tử vi chi tiết',
      { formValues: values }
    );
    
    if (result) {
      setDetailedReading(result);
    }
    
    setLoading(false);
    return result;
  }, [executeWithErrorHandling]);

  /**
   * Xóa dữ liệu bản đọc hiện tại
   */
  const clearReadings = useCallback(() => {
    setBasicReading(null);
    setDetailedReading(null);
  }, []);

  return {
    loading,
    basicReading,
    detailedReading,
    getBasicReading,
    getDetailedReading,
    clearReadings,
  };
} 