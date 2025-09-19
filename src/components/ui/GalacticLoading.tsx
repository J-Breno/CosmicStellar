'use client';

import { useEffect, useState } from 'react';

const GalacticLoading: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stars, setStars] = useState<Array<React.CSSProperties>>([]);
  const [particles, setParticles] = useState<Array<React.CSSProperties>>([]);

  useEffect(() => {
    const generatedStars = [...Array(50)].map(() => ({
      width: `${Math.random() * 4 + 1}px`,
      height: `${Math.random() * 4 + 1}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      backgroundColor: `hsl(${Math.random() * 60 + 200}, 80%, 70%)`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${Math.random() * 2 + 1}s`
    }));

    const generatedParticles = [...Array(20)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${i * 0.3}s`,
      animationDuration: `${Math.random() * 3 + 2}s`
    }));

    setStars(generatedStars);
    setParticles(generatedParticles);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0a2a] via-[#1a1a4a] to-[#0a0a2a]">
      <div className="absolute inset-0">
        {stars.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={style}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-shift font-orbitron">
            COSMIC STELLAR
          </h1>
          <p className="text-gray-300 text-sm mt-2 font-poppins animate-pulse">
            Inicializando sistemas estelares...
          </p>
        </div>

        <div className="w-64 mx-auto mb-4">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-300 ease-out shadow-lg shadow-cyan-400/30"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-cyan-400 text-xs mt-2 font-orbitron">
            {Math.min(100, Math.round(progress))}% CONCLUÍDO
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-float"
            style={style}
          />
        ))}
      </div>
    </div>
  );
};

export default GalacticLoading;