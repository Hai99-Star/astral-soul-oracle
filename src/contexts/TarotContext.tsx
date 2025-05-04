import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { TAROT_CARDS } from '@/constants/tarotCards';
import { TarotCard } from '@/types/tarot';
import { 
  generateTarotIntroduction,
  generateSingleCardTarotReading,
  generateTarot3CardReading
} from '@/services/api/tarotService';
import { 
  TarotContextType, 
  TarotState, 
  ContextProviderProps 
} from './types';

// Define actions
type TarotAction = 
  | { type: 'SET_QUESTION'; payload: string }
  | { type: 'SET_SELECTED_CARD_COUNT'; payload: number }
  | { type: 'SET_SHUFFLING'; payload: boolean }
  | { type: 'SET_SELECTED_CARDS'; payload: number[] }
  | { type: 'REVEAL_CARD'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_READING'; payload: string }
  | { type: 'SET_SHOW_RESULT'; payload: boolean }
  | { type: 'SET_INTRODUCTION'; payload: string }
  | { type: 'SET_LOADING_INTRODUCTION'; payload: boolean }
  | { type: 'SET_SHOW_INTRODUCTION'; payload: boolean }
  | { type: 'SET_SELECTED_SPREAD_TYPE'; payload: string }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: TarotState = {
  question: '',
  selectedCards: [],
  revealedCards: [],
  reading: '',
  isLoading: false,
  isShuffling: false,
  showResult: false,
  showIntroduction: true,
  introduction: '',
  selectedCardCount: 3,
  selectedSpreadType: 'a',
  isLoadingIntroduction: true,
};

// Reducer function
const tarotReducer = (state: TarotState, action: TarotAction): TarotState => {
  switch (action.type) {
    case 'SET_QUESTION':
      return {
        ...state,
        question: action.payload,
      };
    case 'SET_SELECTED_CARD_COUNT':
      return {
        ...state,
        selectedCardCount: action.payload,
        showIntroduction: false,
      };
    case 'SET_SHUFFLING':
      return {
        ...state,
        isShuffling: action.payload,
      };
    case 'SET_SELECTED_CARDS':
      return {
        ...state,
        selectedCards: action.payload,
        revealedCards: [],
      };
    case 'REVEAL_CARD':
      return {
        ...state,
        revealedCards: [...state.revealedCards, action.payload],
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
      };
    case 'SET_SHOW_RESULT':
      return {
        ...state,
        showResult: action.payload,
      };
    case 'SET_INTRODUCTION':
      return {
        ...state,
        introduction: action.payload,
      };
    case 'SET_LOADING_INTRODUCTION':
      return {
        ...state,
        isLoadingIntroduction: action.payload,
      };
    case 'SET_SHOW_INTRODUCTION':
      return {
        ...state,
        showIntroduction: action.payload,
      };
    case 'SET_SELECTED_SPREAD_TYPE':
      return {
        ...state,
        selectedSpreadType: action.payload,
      };
    case 'RESET_FORM':
      return {
        ...initialState,
        introduction: state.introduction,
        isLoadingIntroduction: false,
      };
    default:
      return state;
  }
};

// Create context
const TarotContext = createContext<TarotContextType | undefined>(undefined);

// Provider component
export const TarotProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(tarotReducer, initialState);
  const { toast } = useToast();

  // Load tarot introduction when component mounts
  useEffect(() => {
    async function loadIntroduction() {
      try {
        const intro = await generateTarotIntroduction();
        dispatch({ type: 'SET_INTRODUCTION', payload: intro });
      } catch (error) {
        console.error('Error generating tarot introduction:', error);
        dispatch({ 
          type: 'SET_INTRODUCTION', 
          payload: 'Không thể tải phần giới thiệu về Tarot. Vui lòng thử lại sau.' 
        });
      } finally {
        dispatch({ type: 'SET_LOADING_INTRODUCTION', payload: false });
      }
    }
    
    loadIntroduction();
  }, []);

  const setQuestion = useCallback((question: string) => {
    dispatch({ type: 'SET_QUESTION', payload: question });
  }, []);

  const selectCardCount = useCallback((count: number) => {
    dispatch({ type: 'SET_SELECTED_CARD_COUNT', payload: count });
  }, []);

  const setSelectedSpreadType = useCallback((spreadType: string) => {
    dispatch({ type: 'SET_SELECTED_SPREAD_TYPE', payload: spreadType });
  }, []);

  const toggleIntroduction = useCallback(() => {
    dispatch({ type: 'SET_SHOW_INTRODUCTION', payload: !state.showIntroduction });
  }, [state.showIntroduction]);

  const startReading = useCallback(() => {
    if (!state.question) {
      toast({
        title: "Vui lòng nhập câu hỏi",
        description: "Hãy nhập câu hỏi hoặc điều bạn muốn tìm hiểu qua lá bài Tarot.",
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'SET_SHUFFLING', payload: true });
    dispatch({ type: 'SET_SELECTED_CARDS', payload: [] });
    dispatch({ type: 'SET_SHOW_RESULT', payload: false });
    
    // Simulate card shuffling
    setTimeout(() => {
      const cardIndices = [];
      // Pick the number of cards based on user selection
      while (cardIndices.length < state.selectedCardCount) {
        const randomIdx = Math.floor(Math.random() * TAROT_CARDS.length);
        if (!cardIndices.includes(randomIdx)) {
          cardIndices.push(randomIdx);
        }
      }
      dispatch({ type: 'SET_SELECTED_CARDS', payload: cardIndices });
      dispatch({ type: 'SET_SHUFFLING', payload: false });
    }, 1500);
  }, [state.question, state.selectedCardCount, toast]);

  const revealCard = useCallback((index: number) => {
    if (!state.revealedCards.includes(index)) {
      dispatch({ type: 'REVEAL_CARD', payload: index });
      
      // If all cards are revealed, scroll to the reading button
      setTimeout(() => {
        if (state.revealedCards.length + 1 === state.selectedCards.length) {
          const readingElement = document.getElementById('reading-button');
          if (readingElement) {
            readingElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 500);
    }
  }, [state.revealedCards, state.selectedCards.length]);

  const generateReading = useCallback(async () => {
    if (state.revealedCards.length !== state.selectedCards.length) {
      toast({
        title: "Vui lòng lật tất cả lá bài",
        description: "Hãy lật tất cả lá bài trước khi xem kết quả lá đọc.",
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Get the actual TarotCard objects for the selected cards
      const selectedTarotCards = state.selectedCards.map(index => TAROT_CARDS[index]);
      
      let reading;
      
      if (state.selectedCardCount === 1) {
        // For single card reading
        reading = await generateSingleCardTarotReading(
          state.question,
          selectedTarotCards[0]
        );
      } else if (state.selectedCardCount === 3) {
        // For 3-card reading
        reading = await generateTarot3CardReading(
          state.question,
          selectedTarotCards,
          state.selectedSpreadType
        );
      } else {
        throw new Error("Unsupported card count");
      }
      
      dispatch({ type: 'SET_READING', payload: reading });
      dispatch({ type: 'SET_SHOW_RESULT', payload: true });
      
      // Scroll to results after a brief delay
      setTimeout(() => {
        const resultsElement = document.getElementById('tarot-reading');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating tarot reading:', error);
      toast({
        title: "Không thể tạo kết quả",
        description: "Đã xảy ra lỗi khi phân tích lá bài Tarot. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [
    state.revealedCards.length, 
    state.selectedCards, 
    state.selectedCardCount, 
    state.question, 
    state.selectedSpreadType, 
    toast
  ]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const contextValue: TarotContextType = {
    state,
    setQuestion,
    selectCardCount,
    startReading,
    revealCard,
    generateReading,
    resetForm,
    setSelectedSpreadType,
    toggleIntroduction,
  };

  return (
    <TarotContext.Provider value={contextValue}>
      {children}
    </TarotContext.Provider>
  );
};

// Custom hook to use the tarot context
export const useTarot = () => {
  const context = useContext(TarotContext);
  if (context === undefined) {
    throw new Error('useTarot must be used within a TarotProvider');
  }
  return context;
}; 