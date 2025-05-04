import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AstrologyFormData } from '@/types/astrology';
import { 
  generateAstrologyReading, 
  generateAstrologyDetailedReading 
} from '@/services/api/astrologyService';
import { 
  AstrologyContextType, 
  AstrologyState, 
  ContextProviderProps,
  AstrologyErrorType
} from './types';

// Define actions
type AstrologyAction = 
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<AstrologyFormData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_READING'; payload: string }
  | { type: 'SET_SHOW_RESULT'; payload: boolean }
  | { type: 'TOGGLE_DETAILED_READING' }
  | { type: 'RESET_FORM' }
  | { type: 'FETCH_START' }
  | { type: 'SET_ERROR'; payload: { type: AstrologyErrorType; message: string } };

// Initial state
const initialState: AstrologyState = {
  formData: {
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  },
  reading: '',
  isLoading: false,
  showResult: false,
  useDetailedReading: false,
  error: {
    type: AstrologyErrorType.NONE,
    message: ''
  }
};

// Reducer function
const astrologyReducer = (state: AstrologyState, action: AstrologyAction): AstrologyState => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
        // Xóa lỗi validation khi người dùng cập nhật form
        error: state.error.type === AstrologyErrorType.FORM_VALIDATION 
          ? { type: AstrologyErrorType.NONE, message: '' } 
          : state.error,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_READING':
      return {
        ...state,
        reading: action.payload,
        // Xóa lỗi khi đặt kết quả thành công
        error: { type: AstrologyErrorType.NONE, message: '' },
      };
    case 'SET_SHOW_RESULT':
      return {
        ...state,
        showResult: action.payload,
      };
    case 'TOGGLE_DETAILED_READING':
      return {
        ...state,
        useDetailedReading: !state.useDetailedReading,
      };
    case 'RESET_FORM':
      return {
        ...state,
        reading: '',
        showResult: false,
        error: { type: AstrologyErrorType.NONE, message: '' },
      };
    case 'FETCH_START':
      return {
        ...state,
        isLoading: true,
        reading: '',
        showResult: true,
        error: { type: AstrologyErrorType.NONE, message: '' },
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false, // Luôn tắt loading khi có lỗi
      };
    default:
      return state;
  }
};

// Create context
const AstrologyContext = createContext<AstrologyContextType | undefined>(undefined);

// Provider component
export const AstrologyProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(astrologyReducer, initialState);
  const { toast } = useToast();

  // Tham chiếu đến yêu cầu đang chạy để xử lý race condition
  const latestRequestRef = React.useRef<number>(0);

  const updateFormData = useCallback((data: Partial<AstrologyFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  const toggleDetailedReading = useCallback(() => {
    dispatch({ type: 'TOGGLE_DETAILED_READING' });
  }, []);

  const setError = useCallback((type: AstrologyErrorType, message: string) => {
    dispatch({ type: 'SET_ERROR', payload: { type, message } });
    
    toast({
      title: type === AstrologyErrorType.FORM_VALIDATION ? "Thông tin chưa đầy đủ" : "Lỗi",
      description: message,
      variant: "destructive"
    });
  }, [toast]);

  const generateReading = useCallback(async (submittedData?: AstrologyFormData) => {
    // Sử dụng dữ liệu form từ tham số hoặc từ state nếu không có
    const formData = submittedData || state.formData;
    const { fullName, birthDate, birthTime, birthPlace } = formData;
    
    // Log giá trị form để debug
    console.log('[AstrologyContext] generateReading - form data:', { fullName, birthDate, birthTime, birthPlace });
    
    if (!fullName || !fullName.trim()) {
      setError(AstrologyErrorType.FORM_VALIDATION, "Vui lòng nhập đầy đủ tên của bạn.");
      return;
    }
    
    if (!birthDate || !birthDate.trim()) {
      setError(AstrologyErrorType.FORM_VALIDATION, "Vui lòng nhập ngày sinh của bạn.");
      return;
    }
    
    // Validate date format (dd/mm/yyyy)
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
    if (!datePattern.test(birthDate)) {
      setError(
        AstrologyErrorType.FORM_VALIDATION, 
        "Vui lòng nhập ngày sinh theo định dạng dd/mm/yyyy."
      );
      return;
    }
    
    // Dispatch action để xóa kết quả cũ và đặt trạng thái loading
    dispatch({ type: 'FETCH_START' });
    
    // Tạo ID duy nhất cho yêu cầu hiện tại
    const requestId = Date.now();
    latestRequestRef.current = requestId;
    
    try {
      // Convert empty strings to undefined to match the optional parameter pattern
      const timeParam = birthTime && birthTime.trim() !== '' ? birthTime : undefined;
      const placeParam = birthPlace && birthPlace.trim() !== '' ? birthPlace : undefined;
      
      let jsonString;
      
      if (state.useDetailedReading) {
        jsonString = await generateAstrologyDetailedReading(
          fullName,
          birthDate,
          timeParam,
          placeParam
        );
      } else {
        jsonString = await generateAstrologyReading(
          fullName,
          birthDate,
          timeParam,
          placeParam
        );
      }
      
      // Kiểm tra xem đây có phải là yêu cầu gần nhất không, nếu không thì bỏ qua
      if (latestRequestRef.current !== requestId) {
        console.log('[AstrologyContext] Ignoring stale response from older request');
        return;
      }
      
      console.log('[AstrologyContext] API response received:', jsonString.substring(0, 50) + '...');
      
      // Parse JSON string with error handling
      try {
        // Attempt to parse the JSON response
        const parsedData = JSON.parse(jsonString);
        
        // Kiểm tra thêm cấu trúc dữ liệu
        if (typeof parsedData === 'object' && parsedData !== null && Object.keys(parsedData).length > 0) {
          // Kiểm tra các trường bắt buộc dựa trên loại phân tích
          let isValidStructure = false;
          
          if (state.useDetailedReading) {
            isValidStructure = !!(
              parsedData.gioiThieuChung && 
              parsedData.canChiVaLichAm && 
              parsedData.napAmAmDuongMang && 
              parsedData.vanMenhTongQuan
            );
          } else {
            isValidStructure = !!(
              parsedData.tongQuan && 
              parsedData.diemNoiBat
            );
          }
          
          if (isValidStructure) {
            console.log('[AstrologyContext] Successfully parsed JSON with valid structure');
            // If parsing succeeds and structure is valid, save the original JSON string
            // (We keep it as string because downstream components may need the raw JSON)
            dispatch({ type: 'SET_READING', payload: jsonString });
            
            // Scroll to results after a brief delay
            setTimeout(() => {
              const resultsElement = document.getElementById('astrology-results');
              if (resultsElement) {
                resultsElement.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          } else {
            console.error('[AstrologyContext] JSON structure is invalid - missing required fields');
            setError(
              AstrologyErrorType.PARSING_ERROR,
              "Kết quả phân tích thiếu các trường thông tin quan trọng."
            );
          }
        } else {
          console.error('[AstrologyContext] Parsed data is not a valid object or is empty');
          setError(
            AstrologyErrorType.PARSING_ERROR,
            "Kết quả phân tích trả về rỗng hoặc không đúng định dạng."
          );
        }
      } catch (parseError) {
        console.error('[AstrologyContext] Error parsing JSON response:', parseError);
        console.error('[AstrologyContext] Raw response:', jsonString.substring(0, 200) + '...');
        
        setError(
          AstrologyErrorType.PARSING_ERROR,
          "Không thể đọc được kết quả phân tích. Định dạng dữ liệu không hợp lệ."
        );
      }
    } catch (error) {
      // Kiểm tra xem đây có phải là yêu cầu gần nhất không
      if (latestRequestRef.current !== requestId) {
        return;
      }
      
      console.error('[AstrologyContext] Error generating astrology reading:', error);
      setError(
        AstrologyErrorType.API_ERROR,
        "Đã xảy ra lỗi khi tạo lá số tử vi. Vui lòng thử lại sau."
      );
    } finally {
      // Kiểm tra xem đây có phải là yêu cầu gần nhất không trước khi đặt lại trạng thái
      if (latestRequestRef.current === requestId) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  }, [state.formData, state.useDetailedReading, setError]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const contextValue: AstrologyContextType = {
    state,
    updateFormData,
    generateReading,
    resetForm,
    toggleDetailedReading,
  };

  return (
    <AstrologyContext.Provider value={contextValue}>
      {children}
    </AstrologyContext.Provider>
  );
};

// Custom hook to use the astrology context
export const useAstrology = () => {
  const context = useContext(AstrologyContext);
  if (context === undefined) {
    throw new Error('useAstrology must be used within an AstrologyProvider');
  }
  return context;
}; 