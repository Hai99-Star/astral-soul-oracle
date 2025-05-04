import React from 'react';
import { useTarot } from '@/contexts/TarotContext';
import { 
  TarotHeader,
  TarotIntroduction,
  TarotReading,
  CardSelectionForm,
  ShufflingAnimation,
  TarotCardsDisplay
} from './tarot';

/**
 * Main component của phần Tarot
 * Sử dụng các components nhỏ hơn để hiển thị UI
 */
const TarotSection: React.FC = () => {
  const { 
    state, 
    setQuestion, 
    selectCardCount, 
    startReading, 
    revealCard,
    generateReading,
    resetForm,
    setSelectedSpreadType,
    toggleIntroduction
  } = useTarot();

  const {
    question,
    selectedCards,
    revealedCards,
    reading: tarotReading,
    isLoading: loading,
    isShuffling: shuffling,
    showResult: readingComplete,
    showIntroduction,
    introduction: tarotIntroduction,
    selectedCardCount,
    selectedSpreadType,
    isLoadingIntroduction: loadingIntroduction
  } = state;

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  // Render main content based on current state
  const renderContent = () => {
    // Show introduction if needed
    if (showIntroduction) {
      return (
        <TarotIntroduction
          isLoading={loadingIntroduction}
          introduction={tarotIntroduction}
          selectCardCount={selectCardCount}
        />
      );
    }
    
    // Show reading results if complete
    if (readingComplete) {
      return (
        <TarotReading
          reading={tarotReading}
          question={question}
          selectedCards={selectedCards}
          onReset={resetForm}
        />
      );
    }

    // Show shuffling animation
    if (shuffling) {
      return <ShufflingAnimation />;
    }

    // Show card selection form if no cards selected yet
    if (selectedCards.length === 0) {
    return (
        <CardSelectionForm
          question={question}
          onQuestionChange={handleQuestionChange}
          selectedCardCount={selectedCardCount}
          isDisabled={shuffling || selectedCards.length > 0}
          selectedSpreadType={selectedSpreadType}
          onSpreadTypeChange={setSelectedSpreadType}
          onStartReading={startReading}
        />
      );
    }

    // Show selected cards for interaction
    return (
      <TarotCardsDisplay
        selectedCards={selectedCards}
        revealedCards={revealedCards}
        onRevealCard={revealCard}
        selectedCardCount={selectedCardCount}
        selectedSpreadType={selectedSpreadType}
        onGenerateReading={generateReading}
        isLoading={loading}
      />
    );
  };

  return (
    <div>
      <TarotHeader
        showIntroduction={showIntroduction}
        readingComplete={readingComplete}
        onToggleIntroduction={toggleIntroduction}
      />
      {renderContent()}
    </div>
  );
};

export default TarotSection;
