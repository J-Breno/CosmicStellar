'use client';

import { usePlanetCarousel, Planet } from '@/hooks/usePlanetCarousel';
import { useEffect, useState } from 'react';

const planetNames = {
  terra: 'Terra',
  venus: 'Vênus',
  marte: 'Marte',
  lua: 'Lua'
};

const planetColors = {
  terra: 'from-blue-400 to-emerald-500',
  venus: 'from-amber-400 to-orange-500',
  marte: 'from-red-500 to-amber-600',
  lua: 'from-blue-400 to-white-500'
};

const planetIcons = {
  terra: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
    </svg>
  ),
  venus: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
      <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  marte: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
    </svg>
  ),
  lua: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
    </svg>
  )
};

const PlanetControls: React.FC = () => {
  const { currentPlanet, nextPlanet, prevPlanet, goToPlanet } = usePlanetCarousel();
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePlanetChange = (planet: Planet) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    goToPlanet(planet);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    nextPlanet();
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    prevPlanet();
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex space-x-3 md:space-x-4 relative">
        <div className="absolute top-1/2 left-2 right-2 h-1 bg-gray-800/50 rounded-full -translate-y-1/2 -z-10"></div>
        
        {(Object.keys(planetNames) as Planet[]).map((planet) => (
          <button
            key={planet}
            onClick={() => handlePlanetChange(planet)}
            disabled={isAnimating}
            className={`
              relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-500 
              ${isAnimating ? 'opacity-70' : 'opacity-100'}
              ${currentPlanet === planet
                ? `bg-gradient-to-b ${planetColors[planet]} shadow-lg scale-110 text-white`
                : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/80 hover:scale-105'
              }
              group
            `}
          >
            <div className={`
              mb-2 transition-all duration-300
              ${currentPlanet === planet 
                ? 'text-white scale-110' 
                : 'text-gray-400 group-hover:text-gray-200'
              }
            `}>
              {planetIcons[planet]}
            </div>
            
            <span className="font-orbitron text-xs md:text-sm font-medium tracking-wide transition-all">
              {planetNames[planet]}
            </span>
            
            {currentPlanet === planet && (
              <div className="absolute -bottom-2 w-3 h-3 rotate-45 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-sm shadow-md"></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={handlePrev}
          disabled={isAnimating}
          className={`
            relative p-4 rounded-full transition-all duration-300 group
            ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:scale-110'}
            bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg
            border border-gray-700/50 hover:border-cyan-400/30
          `}
          aria-label="Planeta anterior"
        >
          <svg 
            className="w-6 h-6 text-cyan-400 group-hover:text-white transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 group-hover:bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        <div className="flex items-center">
          <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
              style={{ 
                width: `${((Object.keys(planetNames).indexOf(currentPlanet) + 1) / Object.keys(planetNames).length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={isAnimating}
          className={`
            relative p-4 rounded-full transition-all duration-300 group
            ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:scale-110'}
            bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg
            border border-gray-700/50 hover:border-cyan-400/30
          `}
          aria-label="Próximo planeta"
        >
          <svg 
            className="w-6 h-6 text-cyan-400 group-hover:text-white transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 group-hover:bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
};

export default PlanetControls;