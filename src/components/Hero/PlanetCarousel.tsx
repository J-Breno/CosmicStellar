'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { usePlanetCarousel } from '@/hooks/usePlanetCarousel';
import Earth from '../Planets/Earth';
import Mars from '../Planets/Mars';
import Moon from '../Planets/Moon';
import Venus from '../Planets/Venus';

const PlanetCarousel: React.FC = () => {
  const { currentPlanet } = usePlanetCarousel();
  const controlsRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);  // Estado para garantir execução no cliente

  // Garantir que o código só seja executado no cliente
  useEffect(() => {
    setIsClient(true); // Seta o estado para indicar que o componente está no lado do cliente
  }, []);

  const renderPlanet = () => {
    console.log('Rendering planet:', currentPlanet); // Debug

    if (!isClient) return null; // Retorna null se não for cliente ainda, evitando o erro de hidratação

    switch (currentPlanet) {
      case 'terra':
        return <Earth scale={2} rotationSpeed={0.005} position={[0, 0, 0]} />;
      case 'marte':
        return <Mars scale={1.8} rotationSpeed={0.004} position={[0, 0, 0]} />;
      case 'lua':
        return <Moon scale={1.8} rotationSpeed={0.004} position={[0, 0, 0]} />;
      case 'venus':
        return <Venus scale={1.8} rotationSpeed={0.004} position={[0, 0, 0]} />;
      default:
        return <Earth scale={2} rotationSpeed={0.005} position={[0, 0, 0]} />;
    }
  };

  return (
    <div className="relative h-[400px] w-full flex justify-end">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 25 }}
        className="w-[500px] h-full"
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[15, 10, 10]}
          intensity={2.5}
          castShadow
        />
        <pointLight position={[10, 5, 5]} intensity={1.5} />

        {renderPlanet()}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          rotateSpeed={0.4}
          minDistance={10}
          maxDistance={25}
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
};

export default PlanetCarousel;
