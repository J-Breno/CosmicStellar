'use client';

import { useRef, useMemo, forwardRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';


const MoonSurfaceMaterial = shaderMaterial(
  {
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
    moonMap: null,
    moonNormalMap: null,
    moonSpecularMap: null,
    moonRoughnessMap: null,
    time: 0,
  },
  `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  `
  uniform sampler2D moonMap;
  uniform sampler2D moonNormalMap;
  uniform sampler2D moonSpecularMap;
  uniform sampler2D moonRoughnessMap;
  uniform vec3 lightDirection;
  uniform float time;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  vec3 perturbNormal(vec3 surf_pos, vec3 surf_norm, vec2 uv) {
    vec3 q0 = dFdx(surf_pos);
    vec3 q1 = dFdy(surf_pos);
    vec2 st0 = dFdx(uv);
    vec2 st1 = dFdy(uv);
    
    vec3 S = normalize(q0 * st1.t - q1 * st0.t);
    vec3 T = normalize(-q0 * st1.s + q1 * st0.s);
    vec3 N = normalize(surf_norm);
    
    mat3 tsn = mat3(S, T, N);
    vec3 mapN = texture2D(moonNormalMap, uv).xyz * 2.0 - 1.0;
    mapN.xy *= 2.0; // Normal map mais intenso para crateras
    
    return normalize(tsn * mapN);
  }

  float craterIntensity(vec3 position, vec2 uv) {
    float roughness = texture2D(moonRoughnessMap, uv).r;
    
    float craterPattern = sin(position.x * 15.0) * sin(position.y * 12.0) * sin(position.z * 10.0);
    craterPattern = smoothstep(-0.4, 0.4, craterPattern);
    
    return roughness * 0.8 + craterPattern * 0.2;
  }

  void main() {
    vec3 baseColor = texture2D(moonMap, vUv).rgb;
    
    vec3 moonColor = baseColor * vec3(1.0, 1.0, 1.0); 
    
    float craterIntensity = craterIntensity(vPosition, vUv);
    moonColor *= (1.0 - craterIntensity * 0.3);
    
    vec3 perturbedNormal = perturbNormal(vPosition, vNormal, vUv);
    
    vec3 viewDir = normalize(vViewPosition);
    vec3 lightDir = normalize(lightDirection);
    
    float diffuse = max(dot(perturbedNormal, -lightDir), 0.0);
    vec3 diffuseColor = moonColor * (diffuse * 0.8 + 0.5); // Luz ambiente suave
    
    vec3 reflectDir = reflect(lightDir, perturbedNormal);
    float specular = pow(max(dot(viewDir, reflectDir), 0.0), 35.0);
    
    float specularStrength = texture2D(moonSpecularMap, vUv).r * 0.1;
    vec3 specularColor = vec3(1.0) * specular * specularStrength;
    
    vec3 finalColor = diffuseColor + specularColor;
    
    finalColor = pow(finalColor, vec3(0.7));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
);

const MoonAtmosphereMaterial = shaderMaterial(
  {
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
  },
  `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  `
  uniform vec3 lightDirection;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    
    float thickness = 1.0 - dot(normal, viewDir);
    thickness = pow(thickness, 2.0);
    
    float intensity = thickness * 0.1;
    
    gl_FragColor = vec4(1.0, 1.0, 0.9, intensity * 0.3);
  }
  `
);

extend({ 
  MoonSurfaceMaterial, 
  MoonAtmosphereMaterial
});

declare module '@react-three/fiber' {
  interface ThreeElements {
    moonSurfaceMaterial: ReactThreeElements.Object3DNode<InstanceType<typeof MoonSurfaceMaterial>, typeof MoonSurfaceMaterial>;
    moonAtmosphereMaterial: ReactThreeElements.Object3DNode<InstanceType<typeof MoonAtmosphereMaterial>, typeof MoonAtmosphereMaterial>;
  }
}

interface MoonProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

const Moon: React.FC<MoonProps> = forwardRef(({
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.001
}, ref) => {
  const moonRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const surfaceMaterialRef = useRef<any>(null);

  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    
    const textures = {
      moonMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg'),
      
      moonNormalMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_normal_1024.jpg'),
      
      moonSpecularMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_specular_1024.jpg'),
      
      moonRoughnessMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_bump_1024.jpg')
    };

    Object.values(textures).forEach(texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 8;
    });

    return textures;
  }, []);

  useFrame((state, delta) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += rotationSpeed;
    }
    
    if (surfaceMaterialRef.current) {
      surfaceMaterialRef.current.time += delta;
    }
  });

  return (
    <group position={position} scale={scale} ref={ref}>
      <mesh ref={moonRef}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <moonSurfaceMaterial 
          ref={surfaceMaterialRef}
          moonMap={textures.moonMap}
          moonNormalMap={textures.moonNormalMap}
          moonSpecularMap={textures.moonSpecularMap}
          moonRoughnessMap={textures.moonRoughnessMap}
          lightDirection={new THREE.Vector3(-1, -1, -1).normalize()}
          time={0}
          key={JSON.stringify(textures)}
        />
      </mesh>

      <mesh ref={atmosphereRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[1.0, 64, 64]} />
        <moonAtmosphereMaterial 
          transparent={true}
          depthWrite={false}
          lightDirection={new THREE.Vector3(-1, -1, -1).normalize()}
        />
      </mesh>

      <mesh scale={[1.03, 1.03, 1.03]}>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial
          transparent={true}
          opacity={0.05}
          color={0xffffff}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});

Moon.displayName = 'Moon';

export default Moon;
