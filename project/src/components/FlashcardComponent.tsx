import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';

interface FlashcardComponentProps {
  frontText: string;
  backText: string;
}

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({ frontText, backText }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto">
      <div
        className={`relative w-full h-80 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 flex flex-col justify-center items-center text-white shadow-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">{frontText}</h3>
              <p className="text-blue-100 text-lg mb-6">Click to reveal the answer</p>
              <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                <RotateCcw className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-3xl p-8 flex flex-col justify-center items-center text-white shadow-xl">
            <div className="text-center">
              <p className="text-lg leading-relaxed mb-6">{backText}</p>
              <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                <RotateCcw className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardComponent;