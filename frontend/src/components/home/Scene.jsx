import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import Pencil from './Pencil';
import BackgroundTextStrips from './BackgroundTextStrips';

function seedRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function AnimatedPencil() {
  const pencilGroupRef = useRef();
  const { viewport } = useThree();

  useFrame(() => {
    if (!pencilGroupRef.current) return;

    // Calculate scroll progress (0 to 1)
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

    // Responsive horizontal offset (moves from right side to left side)
    const responsiveX = Math.min(viewport.width * 0.28, 2.5);
    const responsiveY = Math.min(viewport.height * 0.05, 0.4);

    let x;
    let y;
    let z;
    
    // Rotations in radians (Euler)
    let rx; 
    let ry; 
    let rz; 

    // Segment animations based on scroll progress
    if (progress <= 0.25) {
      // 1. Hero -> Problem (Right to Left)
      const t = progress / 0.25;
      x = responsiveX - t * (responsiveX * 2);
      y = -t * responsiveY;
      z = -t * 0.5;
      rx = 0.3 + t * 0.2;
      ry = 0.2 + t * 0.6;
      rz = -0.6 + t * 0.4;
    } else if (progress <= 0.5) {
      // 2. Problem -> Idea (Left to Right)
      const t = (progress - 0.25) / 0.25;
      x = -responsiveX + t * (responsiveX * 2);
      y = -responsiveY + t * (responsiveY * 2);
      z = -0.5 + t * 0.8;
      rx = 0.5 - t * 0.3;
      ry = 0.8 - t * 0.9;
      rz = -0.2 - t * 0.6;
    } else if (progress <= 0.75) {
      // 3. Idea -> Impact (Right to Left)
      const t = (progress - 0.5) / 0.25;
      x = responsiveX - t * (responsiveX * 2);
      y = responsiveY - t * (responsiveY * 2);
      z = 0.3 - t * 0.6;
      rx = 0.2 + t * 0.3;
      ry = -0.1 + t * 0.7;
      rz = -0.8 + t * 0.4;
    } else {
      // 4. Impact -> Final CTA (Left to Center)
      const t = (progress - 0.75) / 0.25;
      x = -responsiveX + t * responsiveX;
      y = -responsiveY + t * (responsiveY - 0.8);
      z = -0.3 + t * 1.6;
      rx = 0.5 + t * 0.6;
      ry = 0.6 - t * 0.6;
      rz = -0.4 + t * 0.4;
    }

    // Smooth physics-like lerp to follow targets
    const lerpSpeed = 0.08;
    pencilGroupRef.current.position.x += (x - pencilGroupRef.current.position.x) * lerpSpeed;
    pencilGroupRef.current.position.y += (y - pencilGroupRef.current.position.y) * lerpSpeed;
    pencilGroupRef.current.position.z += (z - pencilGroupRef.current.position.z) * lerpSpeed;

    pencilGroupRef.current.rotation.x += (rx - pencilGroupRef.current.rotation.x) * lerpSpeed;
    pencilGroupRef.current.rotation.y += (ry - pencilGroupRef.current.rotation.y) * lerpSpeed;
    pencilGroupRef.current.rotation.z += (rz - pencilGroupRef.current.rotation.z) * lerpSpeed;
  });

  return (
    <group ref={pencilGroupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Pencil scale={0.72} />
      </Float>
    </group>
  );
}

function StarfieldParticles() {
  const particlesRef = useRef();
  const count = 120;

  // Generate stable random particle positions
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    let seed = 1.0;
    for (let i = 0; i < count; i++) {
      const r1 = seedRandom(seed++);
      const r2 = seedRandom(seed++);
      const r3 = seedRandom(seed++);
      arr[i * 3] = (r1 - 0.5) * 16;     // X
      arr[i * 3 + 1] = (r2 - 0.5) * 12; // Y
      arr[i * 3 + 2] = (r3 - 0.8) * 8;  // Z
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow drifting rotation
    particlesRef.current.rotation.y = time * 0.015;
    particlesRef.current.rotation.x = time * 0.005;

    // React to scroll for parallax effect
    const scrollY = window.scrollY;
    particlesRef.current.position.y = scrollY * 0.0015;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c84771" // Berry particles for better visibility in light mode
        transparent
        opacity={0.25}
        sizeAttenuation
      />
    </points>
  );
}

export default function Scene({ showPencil = true }) {
  return (
    <div className="fixed inset-0 w-screen h-screen z-0 pointer-events-none bg-[#fdf8f5] overflow-hidden">
      {/* Moving text strips in the background (behind the Canvas) */}
      <BackgroundTextStrips />

      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        {/* Soft background light - brighter for light mode */}
        <ambientLight intensity={0.7} />

        {/* Studio point lights */}
        <pointLight position={[5, 5, 2]} color="#c84771" intensity={2.2} />
        <pointLight position={[-5, -5, 2]} color="#f4989e" intensity={1.5} />

        {/* Strong shadow caster */}
        <directionalLight
          position={[4, 8, 3]}
          intensity={2.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        <StarfieldParticles />
        {showPencil && <AnimatedPencil />}
      </Canvas>
    </div>
  );
}
