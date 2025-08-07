import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import '../styles/3d.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <Canvas className="3d-canvas">
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={false} autoRotate />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#ff3e3e" metalness={0.6} roughness={0.2} />
          </mesh>
        </Canvas>
        
        <div className="hero-content">
          <h1>Build Your <span className="text-red">Perfect</span> Resume with <span className="text-blue">AI</span></h1>
          <p>Let artificial intelligence craft a professional resume that gets you hired</p>
          <div className="cta-buttons">
            <button className="btn-red" onClick={() => navigate('/builder')}>Start for Free</button>
            <button className="btn-blue" onClick={() => navigate('/templates')}>View Templates</button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose <span className="text-blue">Resume</span><span className="text-red">AI</span>?</h2>
        <div className="features-grid">
          {/* Feature cards with 3D hover effects */}
        </div>
      </div>
    </div>
  );
};

export default Home;