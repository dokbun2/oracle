import React, { useState } from 'react';
import { TarotCard } from '../types';
import { MAJOR_ARCANA } from '../constants';

interface TarotDeckProps {
  onCardSelected: (card: TarotCard) => void;
}

const TarotDeck: React.FC<TarotDeckProps> = ({ onCardSelected }) => {
  const [selected, setSelected] = useState(false);

  const handleCardClick = () => {
    if (selected) return;
    setSelected(true);
    
    // Simulate shuffle delay then pick
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * MAJOR_ARCANA.length);
        const card = MAJOR_ARCANA[randomIndex];
        onCardSelected(card);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full animate-fade-in px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display text-slate-100 mb-4 font-bold">
          운명의 순간
        </h2>
        <p className="text-slate-400 text-lg md:text-xl font-medium">
          마음을 차분히 하고 카드를 한 장 선택하세요
        </p>
      </div>
      
      <div className="relative w-full max-w-4xl h-64 md:h-96 flex justify-center items-center perspective-1000 mb-8">
        {Array.from({ length: 5 }).map((_, index) => {
            const rotate = (index - 2) * 8;
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const xOffset = isMobile ? 30 : 60;
            const translateX = (index - 2) * xOffset;
            const translateY = Math.abs(index - 2) * (isMobile ? 10 : 20);
            
            return (
                <div
                    key={index}
                    onClick={handleCardClick}
                    className={`absolute w-32 h-56 md:w-56 md:h-80 bg-orange-950 border-2 border-orange-300 rounded-xl shadow-2xl cursor-pointer transition-all duration-500 hover:-translate-y-6 hover:shadow-[0_0_30px_rgba(234,88,12,0.3)] group ${selected ? 'opacity-0 scale-90' : 'opacity-100'}`}
                    style={{
                        transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg)`,
                        zIndex: selected ? 0 : 10,
                        backgroundImage: `url('https://www.transparenttextures.com/patterns/stardust.png')`,
                        backgroundBlendMode: 'overlay'
                    }}
                >
                    <div className="w-full h-full rounded-xl border-2 border-orange-800/50 flex items-center justify-center bg-gradient-to-br from-orange-900 to-red-950">
                        <span className="text-4xl md:text-5xl text-orange-200/50 group-hover:text-orange-200 transition-colors duration-300">✦</span>
                    </div>
                </div>
            );
        })}
      </div>
      
      {selected && (
          <div className="text-xl text-orange-400 animate-pulse text-center font-bold">
              카드의 에너지를 해석하고 있습니다...
          </div>
      )}
    </div>
  );
};

export default TarotDeck;