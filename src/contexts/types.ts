import { ReactNode } from 'react';
import { AstrologyFormData } from '@/types/astrology';
import { NumerologyFormData } from '@/types/numerology';
import { TarotCard } from '@/types/tarot';

export interface ContextProviderProps {
  children: ReactNode;
}

// Định nghĩa các loại lỗi cho Astrology
export enum AstrologyErrorType {
  NONE = 'NONE',
  FORM_VALIDATION = 'FORM_VALIDATION',
  API_ERROR = 'API_ERROR',
  PARSING_ERROR = 'PARSING_ERROR'
}

// Astrology Context Types
export interface AstrologyState {
  formData: AstrologyFormData;
  reading: string;
  isLoading: boolean;
  showResult: boolean;
  useDetailedReading: boolean;
  error: {
    type: AstrologyErrorType;
    message: string;
  };
}

export interface AstrologyContextType {
  state: AstrologyState;
  updateFormData: (data: Partial<AstrologyFormData>) => void;
  generateReading: (submittedData?: AstrologyFormData) => Promise<void>;
  resetForm: () => void;
  toggleDetailedReading: () => void;
}

// Numerology Context Types
export interface NumerologyState {
  formData: NumerologyFormData;
  reading: string;
  lifePathNumber: number;
  isLoading: boolean;
  showResult: boolean;
}

export interface NumerologyContextType {
  state: NumerologyState;
  updateFormData: (data: Partial<NumerologyFormData>) => void;
  generateReading: () => Promise<void>;
  resetForm: () => void;
}

// Tarot Context Types
export interface TarotState {
  question: string;
  selectedCards: number[];
  revealedCards: number[];
  reading: string;
  isLoading: boolean;
  isShuffling: boolean;
  showResult: boolean;
  showIntroduction: boolean;
  introduction: string;
  selectedCardCount: number;
  selectedSpreadType: string;
  isLoadingIntroduction: boolean;
}

export interface TarotContextType {
  state: TarotState;
  setQuestion: (question: string) => void;
  selectCardCount: (count: number) => void;
  startReading: () => void;
  revealCard: (index: number) => void;
  generateReading: () => Promise<void>;
  resetForm: () => void;
  setSelectedSpreadType: (spreadType: string) => void;
  toggleIntroduction: () => void;
} 