import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Box, Sphere } from '@react-three/drei';
import '../../styles/3DElements.css';

export const FloatingOrbs = () => {
  return (
    <div className="floating-orbs">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ff3e3e" metalness={0.6} roughness={0.2} />
        </Sphere>
        <Sphere args={[0.8, 32, 32]} position={[3, 1, -2]}>
          <meshStandardMaterial color="#3e6bff" metalness={0.6} roughness={0.2} />
        </Sphere>
      </Canvas>
    </div>
  );
};

export const AnimatedCube = ({ position = [0, 0, 0], color = '#ff3e3e', size = 1 }) => {
  return (
    <Box position={position} args={[size, size, size]}>
      <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
    </Box>
  );
};

export const BackgroundParticles = () => {
  return (
    <Canvas className="particles-canvas">
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </Canvas>
  );
};