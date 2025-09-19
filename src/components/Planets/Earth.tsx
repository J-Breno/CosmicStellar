'use client';

import { useRef, useMemo, forwardRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const EarthSurfaceMaterial = shaderMaterial(
  {
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
    worldMap: null,
    earthNightLights: null,
    earthSpecularMap: null,
    earthNormalMap: null,
    earthCloudCover: null,
  },
  `
  varying vec2 vUv;
  varying vec3 pixelPosition;
  varying vec3 vNormal;
  varying vec3 VertexPosition;

  void main() {
    vNormal = mat3(modelMatrix) * normal;
    pixelPosition = mat3(modelMatrix) * position;
    vUv = uv;
    vec4 FinalVertexPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    VertexPosition = vec3(FinalVertexPosition);
    gl_Position = FinalVertexPosition;
  }
  `,
  `
  uniform sampler2D worldMap;
  uniform sampler2D earthSpecularMap;
  uniform sampler2D earthNormalMap;
  uniform sampler2D earthCloudCover;
  uniform sampler2D earthNightLights;
  uniform vec3 lightDirection;

  varying vec3 pixelPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 VertexPosition;

  vec3 perturbNormal2Arb(vec3 surf_norm) {
    vec3 q0 = vec3(dFdx(VertexPosition.x), dFdx(VertexPosition.y), dFdx(VertexPosition.z));
    vec3 q1 = vec3(dFdy(VertexPosition.x), dFdy(VertexPosition.y), dFdy(VertexPosition.z));
    vec2 st0 = dFdx(vUv.st);
    vec2 st1 = dFdy(vUv.st);
    float scale = sign(st1.t * st0.s - st0.t * st1.s);
    vec3 S = normalize((q0 * st1.t - q1 * st0.t) * scale);
    vec3 T = normalize((-q0 * st1.s + q1 * st0.s) * scale);
    vec3 N = normalize(surf_norm);
    mat3 tsn = mat3(S, T, N);
    vec3 mapN = texture2D(earthNormalMap, vUv).xyz * 2.0 - 1.0;
    vec2 normalScale = vec2(1., 1.);
    mapN.xy *= normalScale;
    mapN.xy *= (float(gl_FrontFacing) * 2.0 - 1.0);
    return normalize(tsn * mapN);
  }

  void main() {
    vec3 DiffuseColor = vec3(texture2D(worldMap, vUv));
    vec3 normal = perturbNormal2Arb(vNormal);
    
    float DotProduct = -dot(normal, lightDirection);
    float MaxDotProduct = max(DotProduct, 1.0);
    float ambient = 0.4; 
    vec3 diffuse = (MaxDotProduct + ambient) * DiffuseColor;

    vec4 CloudColor = texture2D(earthCloudCover, vUv);

    float shininess = 20.;
    float specularStrength = (texture2D(earthSpecularMap, vUv).r * 2.) - CloudColor.a;
    vec3 viewDir = normalize(cameraPosition - pixelPosition);
    vec3 reflectDir = reflect(-lightDirection, normal);
    float spec = pow(max(-dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specularColor = vec3(1.0, 0.8, 0.3);
    vec3 specular = spec * specularColor * specularStrength;
    
    vec3 result = (diffuse + specular) * 1.2;

    vec3 earthNightLights = vec3(texture2D(earthNightLights, vUv));
    float DayNightThreshold = smoothstep(-0.05, 0.05, -dot(vNormal, lightDirection));
    result = mix(earthNightLights, result, DayNightThreshold);

    gl_FragColor = vec4(result, 1.0);
  }
  `
);

const CloudsMaterial = shaderMaterial(
  {
    earthCloudCover: null,
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
  },
  `
  varying vec2 vUv;
  varying vec3 vNormal;
  
  void main() {
    vNormal = normalize(mat3(modelMatrix) * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform sampler2D earthCloudCover;
  uniform vec3 lightDirection;

  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec4 DiffuseColor = texture2D(earthCloudCover, vUv);
    float DotProduct = -dot(vNormal, lightDirection);
    float MaxDotProduct = max(DotProduct, 0.0);
    vec4 diffuse = MaxDotProduct * DiffuseColor;
    gl_FragColor = diffuse;
  }
  `
);

const AtmosphereMaterial = shaderMaterial(
  {
    lightDirection: new THREE.Vector3(-1, -1, -1).normalize(),
  },
  `
  varying vec3 pixelPosition;
  varying vec3 vNormal;

  void main() {
    pixelPosition = mat3(modelMatrix) * position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  uniform vec3 lightDirection;

  varying vec3 pixelPosition;
  varying vec3 vNormal;

  void main() {
    vec3 atmosphereColor = vec3(0., 0.2, 1.);
    float dotProduct = -dot(vNormal, lightDirection);
    float maxDotProduct = max(dotProduct, 0.0);
    vec3 viewDirection = normalize(cameraPosition - pixelPosition);
    float edgeDotProduct = 1. - dot(vNormal, viewDirection);
    float fuzziness = smoothstep(0., 0.2, 1. - abs(edgeDotProduct));
    gl_FragColor = vec4(atmosphereColor, maxDotProduct * edgeDotProduct * fuzziness);
  }
  `
);

extend({ 
  EarthSurfaceMaterial, 
  CloudsMaterial, 
  AtmosphereMaterial 
});

declare module '@react-three/fiber' {
  interface ThreeElements {
    earthSurfaceMaterial: ReactThreeElements.Object3DNode<
      InstanceType<typeof EarthSurfaceMaterial>,
      typeof EarthSurfaceMaterial
    >;
    cloudsMaterial: ReactThreeElements.Object3DNode<
      InstanceType<typeof CloudsMaterial>,
      typeof CloudsMaterial
    >;
    atmosphereMaterial: ReactThreeElements.Object3DNode<
      InstanceType<typeof AtmosphereMaterial>,
      typeof AtmosphereMaterial
    >;
  }
}

interface EarthProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

const Earth: React.FC<EarthProps> = forwardRef(({
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.001
}, ref) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const textures = {
      worldMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
      earthNightLights: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.jpg'),
      earthSpecularMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'),
      earthNormalMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg'),
      earthCloudCover: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_2048.png'),
    };

    Object.values(textures).forEach(texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });

    return textures;
  }, []);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 1.1;
    }
  });

  return (
    <group position={position} scale={scale} ref={ref}>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <earthSurfaceMaterial 
          worldMap={textures.worldMap}
          earthNightLights={textures.earthNightLights}
          earthSpecularMap={textures.earthSpecularMap}
          earthNormalMap={textures.earthNormalMap}
          earthCloudCover={textures.earthCloudCover}
          key={JSON.stringify(textures)} 
        />
      </mesh>

      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.53, 64, 64]} />
        <cloudsMaterial 
          earthCloudCover={textures.earthCloudCover}
          transparent={true}
          key={String(textures.earthCloudCover.uuid)}
        />
      </mesh>

      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.55, 64, 64]} />
        <atmosphereMaterial 
          transparent={true}
        />
      </mesh>
    </group>
  );
});

Earth.displayName = 'Earth';

export default Earth;