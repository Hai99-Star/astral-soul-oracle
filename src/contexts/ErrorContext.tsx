import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import errorService, { AppError, ErrorType } from '@/utils/errorService';
import { useToast } from '@/components/ui/use-toast';
import ErrorModal from '@/components/ErrorModal';

// State Type
interface ErrorState {
  errors: AppError[];
  hasErrors: boolean;
  globalError: AppError | null;
}

// Context Type
interface ErrorContextType {
  state: ErrorState;
  addError: (error: AppError) => void;
  clearErrors: () => void;
  clearGlobalError: () => void;
  setGlobalError: (error: AppError) => void;
  handleApiError: (error: any, customMessage?: string, context?: Record<string, any>) => AppError;
}

// Actions
type ErrorAction = 
  | { type: 'ADD_ERROR'; payload: AppError }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_GLOBAL_ERROR'; payload: AppError }
  | { type: 'CLEAR_GLOBAL_ERROR' };

// Initial State
const initialState: ErrorState = {
  errors: [],
  hasErrors: false,
  globalError: null,
};

// Reducer
function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload],
        hasErrors: true,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: [],
        hasErrors: false,
      };
    case 'SET_GLOBAL_ERROR':
      return {
        ...state,
        globalError: action.payload,
      };
    case 'CLEAR_GLOBAL_ERROR':
      return {
        ...state,
        globalError: null,
      };
    default:
      return state;
  }
}

// Create Context
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Provider Component
interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);
  const { toast } = useToast();

  // Add error 
  const addError = useCallback((error: AppError) => {
    // Log error
    errorService.logError(error);
    
    // Add to state
    dispatch({ type: 'ADD_ERROR', payload: error });
    
    // Show toast notification
    toast({
      title: getErrorTitle(error.type),
      description: error.message,
      variant: "destructive",
    });
  }, [toast]);

  // Helper để xác định tiêu đề toast theo loại lỗi
  const getErrorTitle = (type: ErrorType): string => {
    switch (type) {
      case ErrorType.API:
        return "Lỗi API";
      case ErrorType.VALIDATION:
        return "Lỗi dữ liệu";
      case ErrorType.AUTHENTICATION:
        return "Lỗi xác thực";
      case ErrorType.NETWORK:
        return "Lỗi kết nối";
      default:
        return "Lỗi";
    }
  };

  // Set global error
  const setGlobalError = useCallback((error: AppError) => {
    errorService.logError(error);
    dispatch({ type: 'SET_GLOBAL_ERROR', payload: error });
  }, []);

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  // Clear global error
  const clearGlobalError = useCallback(() => {
    dispatch({ type: 'CLEAR_GLOBAL_ERROR' });
  }, []);

  // Handle API error wrapper
  const handleApiError = useCallback((error: any, customMessage?: string, context?: Record<string, any>): AppError => {
    const appError = errorService.handleApiError(error, customMessage, context);
    addError(appError);
    return appError;
  }, [addError]);

  // Context value
  const contextValue: ErrorContextType = {
    state,
    addError,
    clearErrors,
    clearGlobalError,
    setGlobalError,
    handleApiError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
      {state.globalError && (
        <ErrorModal error={state.globalError} onClose={clearGlobalError} />
      )}
    </ErrorContext.Provider>
  );
};

// Custom hook
export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export default ErrorContext; 