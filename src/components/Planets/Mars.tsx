'use client';

import { useRef, useMemo, forwardRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const MarsSurfaceMaterial = shaderMaterial(
  {
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
    marsMap: null,
    marsNormalMap: null,
    marsSpecularMap: null,
    marsRoughnessMap: null,
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
  uniform sampler2D marsMap;
  uniform sampler2D marsNormalMap;
  uniform sampler2D marsSpecularMap;
  uniform sampler2D marsRoughnessMap;
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
    vec3 mapN = texture2D(marsNormalMap, uv).xyz * 2.0 - 1.0;
    mapN.xy *= 1.5; // Intensidade do normal map aumentada para Marte
    
    return normalize(tsn * mapN);
  }

  vec3 addMartianDust(vec3 color, vec3 position, vec3 normal, vec2 uv) {
    float dustPattern = sin(position.y * 8.0 + time * 0.2) * 0.5 + 0.5;
    dustPattern *= sin(position.x * 6.0) * 0.3 + 0.7;
    dustPattern = pow(dustPattern, 2.0);
    
    float dustMap = texture2D(marsRoughnessMap, uv).r;
    dustPattern *= dustMap;
    
    vec3 dustColor = vec3(0.8, 0.35, 0.15);
    
    return mix(color, dustColor, dustPattern * 0.4);
  }

  float surfaceDetails(vec3 position, vec2 uv) {
    float details = sin(position.x * 20.0) * sin(position.y * 15.0) * sin(position.z * 18.0);
    details = smoothstep(-0.3, 0.3, details);
    return details * 0.1;
  }

  void main() {
    vec3 baseColor = texture2D(marsMap, vUv).rgb;
    
    vec3 marsColor = baseColor * vec3(1.3, 0.7, 0.6);
    
    float details = surfaceDetails(vPosition, vUv);
    marsColor *= (1.0 - details);
    
    vec3 perturbedNormal = perturbNormal(vPosition, vNormal, vUv);
    
    vec3 viewDir = normalize(vViewPosition);
    vec3 lightDir = normalize(lightDirection);
    
    float diffuse = max(dot(perturbedNormal, -lightDir), 0.0);
    vec3 diffuseColor = marsColor * (diffuse * 0.9 + 0.9); 
    
    vec3 reflectDir = reflect(lightDir, perturbedNormal);
    float specular = pow(max(dot(viewDir, reflectDir), 0.0), 25.0);
    
    float specularStrength = texture2D(marsSpecularMap, vUv).r * 0.3;
    vec3 specularColor = vec3(1.0, 0.7, 0.4) * specular * specularStrength;
    
    float roughness = texture2D(marsRoughnessMap, vUv).r;
    specularColor *= (1.0 - roughness);
    
    vec3 finalColor = diffuseColor + specularColor;
    
    finalColor = addMartianDust(finalColor, vPosition, vNormal, vUv);
    
    finalColor *= vec3(1.1, 0.85, 0.75);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
  `
);

const MarsAtmosphereMaterial = shaderMaterial(
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
    
    vec3 atmosphereColor = vec3(0.9, 0.35, 0.15);
    
    float thickness = 1.0 - dot(normal, viewDir);
    thickness = pow(thickness, 1.5);
    
    float lightIntensity = max(dot(normal, -lightDirection), 0.0);
    lightIntensity = pow(lightIntensity, 0.5);
    
    float glow = sin(time * 0.3) * 0.9 + 0.9;
    
    vec3 finalColor = atmosphereColor * thickness * lightIntensity * glow * 0.4;
    
    float alpha = thickness * 0.3 * lightIntensity;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
  `
);

const MarsDustMaterial = shaderMaterial(
  {
    time: 0,
  },
  `
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform float time;

  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    float dust = sin(vPosition.x * 10.0 + time * 0.5) * 
                 sin(vPosition.y * 8.0 + time * 0.3) * 
                 sin(vPosition.z * 12.0 + time * 0.4);
    
    dust = smoothstep(0.0, 0.3, dust);
    
    vec3 dustColor = vec3(0.8, 0.3, 0.1);
    
    float alpha = dust * 0.15;
    
    gl_FragColor = vec4(dustColor, alpha);
  }
  `
);

extend({ 
  MarsSurfaceMaterial, 
  MarsAtmosphereMaterial,
  MarsDustMaterial
});

declare module '@react-three/fiber' {
  interface ThreeElements {
    marsSurfaceMaterial: ReactThreeElements.Object3DNode<
      InstanceType<typeof MarsSurfaceMaterial>,
      typeof MarsSurfaceMaterial
    >;
    marsAtmosphereMaterial: ReactThreeElements.Object3DNode<
      InstanceType<typeof MarsAtmosphereMaterial>,
      typeof MarsAtmosphereMaterial
    >;
    marsDustMaterial: ReactThreeElements.Object3DNode<
      InstanceType<typeof MarsDustMaterial>,
      typeof MarsDustMaterial
    >;
  }
}

interface MarsProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

const Mars: React.FC<MarsProps> = forwardRef(({
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.001
}, ref) => {
  const marsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const dustRef = useRef<THREE.Mesh>(null);
  const surfaceMaterialRef = useRef<any>(null);
  const atmosphereMaterialRef = useRef<any>(null);
  const dustMaterialRef = useRef<any>(null);

  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    
    const textures = {
      marsMap: loader.load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/06a094a4-7bd7-4bb9-b998-6c1e17f66c08/dbpke7f-5e92698f-21a9-4ca1-9fb3-25b4709541fa.jpg/v1/fill/w_1024,h_512,q_75,strp/mars_texture_map_16k___mars_global_surveyor_by_fargetanik_dbpke7f-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6Ii9mLzA2YTA5NGE0LTdiZDctNGJiOS1iOTk4LTZjMWUxN2Y2NmMwOC9kYnBrZTdmLTVlOTI2OThmLTIxYTktNGNhMS05ZmIzLTI1YjQ3MDk1NDFmYS5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.skHyUlrX6zOM_5cUSzFU44TarM4wAs-csOQxzESKTQo'), 
      marsNormalMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg'), 
      marsSpecularMap: loader.load('https://example.com/path-to-mars-specular-map.jpg'), 
      marsRoughnessMap: loader.load('https://example.com/path-to-mars-roughness-map.jpg'), 
  };

    Object.values(textures).forEach(texture => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.anisotropy = 16;
    });

    return textures;
    }, []);

  useFrame((state, delta) => {
    if (marsRef.current) {
      marsRef.current.rotation.y += rotationSpeed;
    }
    
    if (surfaceMaterialRef.current) {
      surfaceMaterialRef.current.time += delta;
    }
    if (atmosphereMaterialRef.current) {
      atmosphereMaterialRef.current.time += delta;
    }
    if (dustMaterialRef.current) {
      dustMaterialRef.current.time += delta;
    }
  });

  return (
    <group position={position} scale={scale} ref={ref}>
      <mesh ref={marsRef}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <marsSurfaceMaterial 
          ref={surfaceMaterialRef}
          marsMap={textures.marsMap}
          marsNormalMap={textures.marsNormalMap}
          marsSpecularMap={textures.marsSpecularMap}
          marsRoughnessMap={textures.marsRoughnessMap}
          lightDirection={new THREE.Vector3(-1, -1, -1).normalize()}
          time={0}
          key={JSON.stringify(textures)}
        />
      </mesh>

      <mesh ref={atmosphereRef} scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <marsAtmosphereMaterial 
          ref={atmosphereMaterialRef}
          transparent={true}
          depthWrite={false}
          lightDirection={new THREE.Vector3(-1, -1, -1).normalize()}
          time={0}
        />
      </mesh>

      

      <mesh scale={[1.04, 1.04, 1.04]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          transparent={true}
          opacity={0.08}
          color={0xff4500}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
});

Mars.displayName = 'Mars';

export default Mars;