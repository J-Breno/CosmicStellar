'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { gsap } from 'gsap';

export type Planet = 'terra' | 'venus' | 'marte' | 'lua';

interface PlanetCarouselContextType {
  currentPlanet: Planet;
  nextPlanet: () => void;
  prevPlanet: () => void;
  goToPlanet: (planet: Planet) => void;
  isAnimating: boolean;
}

const PlanetCarouselContext = createContext<PlanetCarouselContextType | undefined>(undefined);

export const PlanetCarouselProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlanet, setCurrentPlanet] = useState<Planet>('terra');
  const [isAnimating, setIsAnimating] = useState(false);

  const planets: Planet[] = ['terra', 'venus', 'marte', 'lua'];

  const animateTransition = useCallback((newPlanet: Planet) => {
    setIsAnimating(true);
    
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    });
    
    tl.to('.planet-container', {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .to('.planet-content', {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.inOut'
    }, 0)
    .call(() => {
      setCurrentPlanet(newPlanet);
    })
    .to('.planet-container', {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out'
    })
    .to('.planet-content', {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
      stagger: 0.1
    }, '-=0.3');

    return tl;
  }, []);

  const nextPlanet = useCallback(() => {
    if (isAnimating) return;
    
    const currentIndex = planets.indexOf(currentPlanet);
    const nextIndex = (currentIndex + 1) % planets.length;
    animateTransition(planets[nextIndex]);
  }, [currentPlanet, planets, animateTransition, isAnimating]);

  const prevPlanet = useCallback(() => {
    if (isAnimating) return;
    
    const currentIndex = planets.indexOf(currentPlanet);
    const prevIndex = (currentIndex - 1 + planets.length) % planets.length;
    animateTransition(planets[prevIndex]);
  }, [currentPlanet, planets, animateTransition, isAnimating]);

  const goToPlanet = useCallback((planet: Planet) => {
    if (isAnimating || currentPlanet === planet) return;
    animateTransition(planet);
  }, [animateTransition, currentPlanet, isAnimating]);

  return (
    <PlanetCarouselContext.Provider
      value={{
        currentPlanet,
        nextPlanet,
        prevPlanet,
        goToPlanet,
        isAnimating
      }}
    >
      {children}
    </PlanetCarouselContext.Provider>
  );
};

export const usePlanetCarousel = (): PlanetCarouselContextType => {
  const context = useContext(PlanetCarouselContext);
  if (context === undefined) {
    throw new Error('usePlanetCarousel must be used within a PlanetCarouselProvider');
  }
  return context;
};