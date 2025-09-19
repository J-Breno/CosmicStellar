'use client';

import { Canvas } from '@react-three/fiber';
import Stars from './Stars';
import ShootingStars from './ShootingStars';
import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SpaceBackground: React.FC = () => {
  useEffect(() => {
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none space-bg">
      <ShootingStars />
      <Stars />
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ position: 'fixed' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
      </Canvas>
    </div>
  );
};

export default SpaceBackground;