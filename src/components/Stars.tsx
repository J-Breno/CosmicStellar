'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface StarFieldProps {
  depth?: number;
  count?: number;
  size?: number;
}

const StarField: React.FC<StarFieldProps> = ({ 
  depth = 1, 
  count = 5000, 
  size = 0.01 
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.05 * depth;
      meshRef.current.rotation.y += delta * 0.03 * depth;
      
      // Piscar suavemente
      const scale = 0.95 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Points ref={meshRef} positions={particlesPosition}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

interface StarsProps {
  className?: string;
  layers?: number;
}

const Stars: React.FC<StarsProps> = ({ className = '', layers = 3 }) => {
  return (
    <div className={`fixed inset-0 -z-50 ${className}`}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        {Array.from({ length: layers }, (_, i) => (
          <StarField
            key={i}
            depth={1 + i * 0.5}
            count={Math.floor(2000 * (i + 1))}
            size={0.005 * (layers - i)}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default Stars;