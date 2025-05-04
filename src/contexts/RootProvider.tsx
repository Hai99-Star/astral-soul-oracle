import React, { ReactNode } from 'react';
import { AstrologyProvider } from './AstrologyContext';
import { NumerologyProvider } from './NumerologyContext';
import { TarotProvider } from './TarotContext';
import { ErrorProvider } from './ErrorContext';
import ErrorBoundary from '@/components/ErrorBoundary';

interface RootProviderProps {
  children: ReactNode;
}

export const RootProvider: React.FC<RootProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <AstrologyProvider>
          <NumerologyProvider>
            <TarotProvider>
              {children}
            </TarotProvider>
          </NumerologyProvider>
        </AstrologyProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}; 