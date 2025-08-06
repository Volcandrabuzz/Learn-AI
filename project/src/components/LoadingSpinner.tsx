import React from 'react';
import { BookOpen, Sparkles, Brain } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      <div className="text-center relative">
        {/* Main 3D Spinner Container */}
        <div className="relative w-32 h-32 mx-auto mb-12">
          {/* Outer rotating ring */}
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin shadow-lg"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'perspective(1000px) rotateX(12deg)'
            }}
          ></div>
          
          {/* Middle rotating ring */}
          <div 
            className="absolute inset-2 rounded-full border-4 border-transparent border-b-indigo-500 border-l-cyan-500 animate-spin shadow-md" 
            style={{ 
              animationDirection: 'reverse', 
              animationDuration: '1.5s',
              transformStyle: 'preserve-3d',
              transform: 'perspective(1000px) rotateX(12deg)'
            }}
          ></div>
          
          {/* Inner rotating ring */}
          <div 
            className="absolute inset-4 rounded-full border-4 border-transparent border-t-violet-500 border-r-blue-400 animate-spin shadow-sm" 
            style={{ 
              animationDuration: '0.8s',
              transformStyle: 'preserve-3d',
              transform: 'perspective(1000px) rotateX(12deg)'
            }}
          ></div>
          
          {/* Center glowing orb */}
          <div className="absolute inset-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 animate-pulse shadow-2xl">
            <div className="w-full h-full rounded-full bg-gradient-to-t from-white/20 to-transparent"></div>
          </div>
          
          {/* Floating icons */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <BookOpen className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 text-blue-600 drop-shadow-lg" />
            <Brain className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-6 h-6 text-purple-600 drop-shadow-lg" />
            <Sparkles className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 text-indigo-600 drop-shadow-lg" />
          </div>
          
          {/* Rotating particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg animate-spin origin-center"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 45}deg) translateX(60px) translateY(-50%)`,
                animationDuration: '2s',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div className="w-full h-full rounded-full bg-white/30"></div>
            </div>
          ))}
        </div>

        {/* 3D Text with shadow */}
        <div className="relative">
          <h2 
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
            style={{ 
              textShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transform: 'perspective(500px) rotateX(5deg)'
            }}
          >
            {message}
          </h2>
          <div 
            className="absolute inset-0 text-3xl font-bold text-gray-200 -z-10"
            style={{ transform: 'translate(2px, 2px)' }}
          >
            {message}
          </div>
        </div>
        
        <p 
          className="text-gray-600 animate-pulse text-lg mb-6"
          style={{ transform: 'perspective(300px) rotateX(2deg)' }}
        >
          Please wait while we prepare your personalized learning experience...
        </p>

        {/* Enhanced animated progress bar */}
        <div className="w-80 h-2 bg-gray-200 rounded-full mx-auto mb-6 shadow-inner">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full shadow-lg animate-pulse relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
            <div className="absolute right-0 top-1/2 w-4 h-4 bg-white rounded-full shadow-lg animate-bounce" style={{ transform: 'translateY(-50%) translateX(50%)' }}></div>
          </div>
        </div>
                
        {/* 3D Animated dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded-full shadow-lg animate-bounce relative"
              style={{ 
                animationDelay: `${i * 0.15}s`,
                transform: 'perspective(100px) rotateX(15deg)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent rounded-full"></div>
              <div 
                className="absolute left-1/2 w-2 h-1 bg-blue-300/30 rounded-full blur-sm"
                style={{ 
                  bottom: '-4px',
                  transform: 'translateX(-50%)'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Floating background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-blue-300/40 to-purple-300/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Subtle glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      </div>


    </div>
  );
};

export default LoadingSpinner;