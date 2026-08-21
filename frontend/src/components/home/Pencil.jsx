import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

export default function Pencil(props) {
  const pencilRef = useRef();

  // Subtle idle animation to make the pencil feel "alive" when not scrolling
  useFrame((state) => {
    if (pencilRef.current) {
      const time = state.clock.getElapsedTime();
      pencilRef.current.position.y += Math.sin(time * 1.5) * 0.0008;
      pencilRef.current.rotation.y += Math.cos(time * 0.8) * 0.001;
    }
  });

  return (
    <group ref={pencilRef} {...props}>
      {/* Sparkles effect at the very tip of the lead (Y = 1.85) */}
      <group position={[0, 1.85, 0]}>
        <Sparkles 
          count={20} 
          scale={0.4} 
          size={3.0} 
          speed={1.5} 
          color="#fbbf24" // Twinkling gold spark color
          noise={0.5}
        />
        {/* Subtle glow light source emanating from the pencil tip */}
        <pointLight 
          color="#fbbf24" 
          intensity={2.0} 
          distance={1.5} 
          decay={2}
        />
      </group>

      {/* 1. Main Hexagonal Pencil Body */}
      {/* Height is 2.4, Y=0. Color is Berry Pink (#c84771) */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 2.4, 6]} />
        <meshStandardMaterial 
          color="#c84771" 
          roughness={0.2}
          metalness={0.15}
          flatShading={true}
        />
      </mesh>

      {/* 2. Shaved Wood Cone Tip */}
      <mesh castShadow receiveShadow position={[0, 1.45, 0]}>
        <coneGeometry args={[0.15, 0.5, 6]} />
        <meshStandardMaterial 
          color="#dfc09c" 
          roughness={0.85}
          metalness={0.0}
          flatShading={true}
        />
      </mesh>

      {/* 3. Graphite Lead Tip */}
      <mesh castShadow receiveShadow position={[0, 1.775, 0]}>
        <coneGeometry args={[0.045, 0.15, 6]} />
        <meshStandardMaterial 
          color="#231219" 
          roughness={0.6}
          metalness={0.5}
          flatShading={true}
        />
      </mesh>

      {/* 4. Metal Ferrule (Collar) */}
      <mesh castShadow position={[0, -1.325, 0]}>
        <cylinderGeometry args={[0.152, 0.152, 0.25, 16]} />
        <meshStandardMaterial 
          color="#fbbf24" // Gold ferrule
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* 5. Eraser */}
      <mesh castShadow position={[0, -1.575, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.25, 16]} />
        <meshStandardMaterial 
          color="#f4989e" 
          roughness={0.5}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}
