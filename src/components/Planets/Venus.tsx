'use client';

import { useRef, useMemo, forwardRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const VenusSurfaceMaterial = shaderMaterial(
  {
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
    venusMap: null,
    venusNormalMap: null,
    venusSpecularMap: null,
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
  uniform sampler2D venusMap;
  uniform sampler2D venusNormalMap;
  uniform sampler2D venusSpecularMap;
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
    vec3 mapN = texture2D(venusNormalMap, uv).xyz * 2.0 - 1.0;
    mapN.xy *= 1.2; // Normal map suave para Vênus
    
    return normalize(tsn * mapN);
  }

  vec3 addVenusClouds(vec3 color, vec3 position, vec2 uv) {
    float cloudPattern = sin(position.x * 8.0 + time * 0.1) * 
                         sin(position.y * 6.0 + time * 0.05) * 
                         sin(position.z * 7.0 + time * 0.08);
    
    cloudPattern = smoothstep(-0.2, 0.2, cloudPattern);
    
    vec3 cloudColor = vec3(0.8, 0.2, 0); // (1.9, 0.8, 0.2);
    
    return mix(color, cloudColor, cloudPattern * 0.3);
  }

  float surfaceDetails(vec3 position, vec2 uv) {
    float details = sin(position.x * 12.0) * sin(position.y * 10.0) * sin(position.z * 14.0);
    details = smoothstep(-0.4, 0.4, details);
    return details * 0.15;
  }

  void main() {
    vec3 baseColor = texture2D(venusMap, vUv).rgb;
    
    if (length(baseColor) < 0.1) {
      baseColor = vec3(0.9, 0.6, 0.3); // Amarelo-alaranjado de Vênus
    }
    
    vec3 venusColor = baseColor * vec3(1.9, 0.8, 0.2);
    
    float details = surfaceDetails(vPosition, vUv);
    venusColor = mix(venusColor, venusColor * 0.8, details);
    
    vec3 perturbedNormal = perturbNormal(vPosition, vNormal, vUv);
    
    vec3 viewDir = normalize(vViewPosition);
    vec3 lightDir = normalize(lightDirection);
    
    float diffuse = max(dot(perturbedNormal, -lightDir), 0.0);
    vec3 diffuseColor = venusColor * (diffuse * 0.7 + 0.5); // Mais luz ambiente
    
    vec3 reflectDir = reflect(lightDir, perturbedNormal);
    float specular = pow(max(dot(viewDir, reflectDir), 0.0), 40.0);
    
    float specularStrength = texture2D(venusSpecularMap, vUv).r * 0.2;
    vec3 specularColor = vec3(1.0, 0.8, 0.5) * specular * specularStrength;
    
    vec3 finalColor = diffuseColor + specularColor;
    
    finalColor = addVenusClouds(finalColor, vPosition, vUv);
    
    finalColor = pow(finalColor, vec3(0.9));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
);

const VenusAtmosphereMaterial = shaderMaterial(
  {
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
    time: 0,
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
  uniform float time;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);
    
    vec3 atmosphereColor = vec3(1.0, 0.75, 0.3);
    
    float thickness = 1.0 - dot(normal, viewDir);
    thickness = pow(thickness, 1.2);
    
    float lightIntensity = max(dot(normal, -lightDirection), 0.0);
    lightIntensity = pow(lightIntensity, 0.3);
    
    float glow = sin(time * 0.2) * 0.1 + 0.9;
    
    vec3 finalColor = atmosphereColor * thickness * lightIntensity * glow * 0.6;
    
    float alpha = thickness * 0.4 * lightIntensity;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
  `
);

const VenusCloudMaterial = shaderMaterial(
  {
    time: 0,
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
  },
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
  `,
  `
  uniform float time;
  uniform vec3 lightDirection;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    float cloudPattern = sin(vUv.x * 20.0 + time * 0.3) * 
                         sin(vUv.y * 15.0 + time * 0.2) * 
                         sin(vUv.x * vUv.y * 25.0 + time * 0.4);
    
    cloudPattern = smoothstep(-0.3, 0.3, cloudPattern);
    
    vec3 cloudColor = vec3(1.0, 0.5, 0.5);
    
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightDirection);
    float lightIntensity = max(dot(normal, -lightDir), 0.0);
    
    float alpha = cloudPattern * 0.3 * (lightIntensity * 0.5 + 0.5);
    
    gl_FragColor = vec4(cloudColor, alpha);
  }
  `
);

extend({ 
  VenusSurfaceMaterial, 
  VenusAtmosphereMaterial,
  VenusCloudMaterial
});

declare module '@react-three/fiber' {
  interface ThreeElements {
    venusSurfaceMaterial: ReactThreeElements.Object3DNode<
      InstanceType<typeof VenusSurfaceMaterial>,
      typeof VenusSurfaceMaterial
    >;
    venusAtmosphereMaterial: ReactThreeElements.Object3DNode<
      InstanceType<typeof VenusAtmosphereMaterial>,
      typeof VenusAtmosphereMaterial
    >;
    venusCloudMaterial: ReactThreeElements.Object3DNode<
      InstanceType<typeof VenusCloudMaterial>,
      typeof VenusCloudMaterial
    >;
  }
}

interface VenusProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

const Venus: React.FC<VenusProps> = forwardRef(({
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.0008
}, ref) => {
  const venusRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const surfaceMaterialRef = useRef<any>(null);
  const atmosphereMaterialRef = useRef<any>(null);
  const cloudMaterialRef = useRef<any>(null);

  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    
    const textures = {
      venusMap: loader.load('https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg'),
      
      venusNormalMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg'),
      
      venusSpecularMap: loader.load('https://www.solarsystemscope.com/textures/download/2k_venus_specular.jpg'),
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
    if (venusRef.current) {
      venusRef.current.rotation.y += rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 1.2;
    }
    
    if (surfaceMaterialRef.current) {
      surfaceMaterialRef.current.time += delta;
    }
    if (atmosphereMaterialRef.current) {
      atmosphereMaterialRef.current.time += delta;
    }
    if (cloudMaterialRef.current) {
      cloudMaterialRef.current.time += delta;
    }
  });

  return (
    <group position={position} scale={scale} ref={ref}>
      <mesh ref={venusRef}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <venusSurfaceMaterial 
          ref={surfaceMaterialRef}
          venusMap={textures.venusMap}
          venusNormalMap={textures.venusNormalMap}
          venusSpecularMap={textures.venusSpecularMap}
          lightDirection={new THREE.Vector3(-1, -1, -1).normalize()}
          time={0}
          key={JSON.stringify(textures)}
        />
      </mesh>

     

      

      <mesh scale={[1.06, 1.06, 1.06]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          transparent={true}
          opacity={0.1}
          color={0xffaa33}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});

Venus.displayName = 'Venus';

export default Venus;