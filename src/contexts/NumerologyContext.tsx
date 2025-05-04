import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { NumerologyFormData } from '@/types/numerology';
import { 
  generateNumerologyReading, 
  calculateLifePathNumber 
} from '@/services/api/numerologyService';
import { 
  NumerologyContextType, 
  NumerologyState, 
  ContextProviderProps 
} from './types';

// Define actions
type NumerologyAction = 
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<NumerologyFormData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_READING'; payload: { reading: string; lifePathNumber: number } }
  | { type: 'SET_SHOW_RESULT'; payload: boolean }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: NumerologyState = {
  formData: {
    fullName: '',
    birthDate: '',
  },
  reading: '',
  lifePathNumber: 0,
  isLoading: false,
  showResult: false,
};

// Reducer function
const numerologyReducer = (state: NumerologyState, action: NumerologyAction): NumerologyState => {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_READING':
      return {
        ...state,
        reading: action.payload.reading,
        lifePathNumber: action.payload.lifePathNumber,
      };
    case 'SET_SHOW_RESULT':
      return {
        ...state,
        showResult: action.payload,
      };
    case 'RESET_FORM':
      return {
        ...state,
        reading: '',
        lifePathNumber: 0,
        showResult: false,
      };
    default:
      return state;
  }
};

// Create context
const NumerologyContext = createContext<NumerologyContextType | undefined>(undefined);

// Provider component
export const NumerologyProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(numerologyReducer, initialState);
  const { toast } = useToast();

  const updateFormData = useCallback((data: Partial<NumerologyFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
  }, []);

  const generateReading = useCallback(async () => {
    const { fullName, birthDate } = state.formData;
    
    if (!fullName || !birthDate) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng nhập đầy đủ tên và ngày sinh của bạn.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate date format (dd/mm/yyyy)
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
    if (!datePattern.test(birthDate)) {
      toast({
        title: "Định dạng ngày không hợp lệ",
        description: "Vui lòng nhập ngày sinh theo định dạng dd/mm/yyyy.",
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    const lifePathNumber = calculateLifePathNumber(birthDate);
    
    try {
      const reading = await generateNumerologyReading(fullName, birthDate);
      
      dispatch({ 
        type: 'SET_READING', 
        payload: { 
          reading,
          lifePathNumber
        }
      });
      dispatch({ type: 'SET_SHOW_RESULT', payload: true });
      
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
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.formData, toast]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const contextValue: NumerologyContextType = {
    state,
    updateFormData,
    generateReading,
    resetForm,
  };

  return (
    <NumerologyContext.Provider value={contextValue}>
      {children}
    </NumerologyContext.Provider>
  );
};

// Custom hook to use the numerology context
export const useNumerology = () => {
  const context = useContext(NumerologyContext);
  if (context === undefined) {
    throw new Error('useNumerology must be used within a NumerologyProvider');
  }
  return context;
}; 