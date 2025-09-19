'use client';

import { useEffect, useRef } from 'react';

interface StarStyle extends React.CSSProperties {
  '--star-color': string;
  '--star-tail-length': string;
  '--star-tail-height': string;
  '--star-width': string;
  '--fall-duration': string;
  '--tail-fade-duration': string;
  '--top-offset': string;
  '--fall-delay': string;
}

const ShootingStars: React.FC = () => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createStars = () => {
      if (!starsRef.current) return;

      starsRef.current.innerHTML = '';

      const starCount = 50;
      const stars = [];

      for (let i = 1; i <= starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const starTailLength = `${(Math.random() * (750 - 500) + 500) / 100}em`;
        const topOffset = `${(Math.random() * 10000) / 100}vh`;
        const fallDuration = `${(Math.random() * (12000 - 6000) + 6000) / 1000}s`;
        const fallDelay = `${(Math.random() * 10000) / 1000}s`;

        const starStyle: StarStyle = {
          '--star-color': '#fff',
          '--star-tail-length': starTailLength,
          '--star-tail-height': '2px',
          '--star-width': `calc(${starTailLength} / 6)`,
          '--fall-duration': fallDuration,
          '--tail-fade-duration': fallDuration,
          '--top-offset': topOffset,
          '--fall-delay': fallDelay,
        };

        Object.assign(star.style, starStyle);
        stars.push(star);
      }

      starsRef.current.append(...stars);
    };

    createStars();

    const handleResize = () => createStars();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={starsRef}
      className="stars fixed top-0 left-0 w-full h-[120%] transform -rotate-45 pointer-events-none z-40"
    />
  );
};

export default ShootingStars;