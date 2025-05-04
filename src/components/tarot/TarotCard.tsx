import React from 'react';
import AstrologyIcon from '../AstrologyIcon';
import {
  CardContainer,
  CardWrapper,
  CardInner,
  CardBack,
  CardBackDesign,
  MysticalSymbol,
  CardFront,
  CardImage,
  CardTitle
} from '@/styles/components/tarot/TarotCard.styles';

interface TarotCardProps {
  cardIndex: number;
  position: number;
  isRevealed: boolean;
  onClick: () => void;
  cardImage: string;
  cardName: string;
  cardNameVi: string;
}

/**
 * Component hiển thị một lá bài Tarot
 */
const TarotCard: React.FC<TarotCardProps> = ({
  cardIndex,
  position,
  isRevealed,
  onClick,
  cardImage,
  cardName,
  cardNameVi
}) => {
  return (
    <CardContainer onClick={onClick}>
      <CardWrapper isRevealed={isRevealed} position={position}>
        <CardInner isRevealed={isRevealed}>
          <CardBack>
            <CardBackDesign>
              <MysticalSymbol>
                <AstrologyIcon className="h-12 w-12 mx-auto" />
              </MysticalSymbol>
            </CardBackDesign>
          </CardBack>
          <CardFront>
            <CardImage src={cardImage} alt={cardName} />
            <CardTitle>
              <h5>{cardName}</h5>
              <p>{cardNameVi}</p>
            </CardTitle>
          </CardFront>
        </CardInner>
      </CardWrapper>
    </CardContainer>
  );
};

export default TarotCard; 