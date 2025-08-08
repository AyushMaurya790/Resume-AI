import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Typography, Button, Box } from '@mui/material';
import '../styles/3d.css';

const Home = () => {
  const navigate = useNavigate();
  const [aiPrompt, setAiPrompt] = useState('');

  // Simulate AI-driven CTA prompt
  useEffect(() => {
    const prompts = [
      "Ready to land your dream job? Let AI craft your perfect resume in minutes!",
      "AI-powered resume builder that gets you noticed by recruiters",
      "Create a professional resume that passes ATS with our AI technology"
    ];
    setAiPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  const features = [
    {
      title: 'AI-Powered Resume Builder',
      description: 'Our AI analyzes job descriptions and crafts tailored content for your resume.',
      icon: '🤖',
      color: '#FF6B6B'
    },
    {
      title: 'ATS-Optimized Templates',
      description: '25+ professional templates designed to pass Applicant Tracking Systems.',
      icon: '📄',
      color: '#4ECDC4'
    },
    {
      title: 'Real-Time Feedback',
      description: 'Get instant AI-powered suggestions to improve your resume score.',
      icon: '💯',
      color: '#FFD166'
    },
    {
      title: 'One-Click Apply',
      description: 'Export to PDF or share directly with employers in one click.',
      icon: '🚀',
      color: '#06D6A0'
    },
  ];

  const testimonials = [
    {
      quote: "Got 3 interviews in the first week after using ResumeAI!",
      author: "Sarah K., Software Engineer",
      avatar: "/avatars/1.jpg"
    },
    {
      quote: "The AI suggestions helped me highlight skills I didn't know were important.",
      author: "Michael T., Marketing Manager",
      avatar: "/avatars/2.jpg"
    },
    {
      quote: "Finally a resume builder that understands what recruiters want to see.",
      author: "David L., Product Designer",
      avatar: "/avatars/3.jpg"
    }
  ];

  return (
    <div className="home-page">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>ResumeAI - AI-Powered Resume Builder | Create Professional Resumes</title>
        <meta
          name="description"
          content="Build professional, ATS-friendly resumes with ResumeAI. Our AI-powered builder creates tailored resumes that get you hired faster."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h1" className="hero-title">
                Build Your <span className="text-blue">Perfect</span> Resume with <span className="text-red">AI</span>
              </Typography>
              <Typography variant="subtitle1" className="hero-subtitle">
                {aiPrompt}
              </Typography>
              <div className="hero-cta">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/builder')}
                  className="cta-button"
                >
                  Create My Resume - It's Free
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/templates')}
                  className="cta-button"
                >
                  View Templates
                </Button>
              </div>
            </motion.div>
          </div>
          <div className="hero-image">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
              <mesh>
                <boxGeometry args={[3, 3, 3]} />
                <meshStandardMaterial color="#3a86ff" metalness={0.7} roughness={0.3} />
              </mesh>
            </Canvas>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <Typography variant="h2" className="section-title">
          How ResumeAI <span className="text-blue">Works</span>
        </Typography>
        <div className="steps-container">
          {[1, 2, 3, 4].map((step) => (
            <motion.div 
              key={step}
              className="step-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: step * 0.1 }}
            >
              <div className="step-number">{step}</div>
              <Typography variant="h3" className="step-title">
                {step === 1 && 'Enter Your Details'}
                {step === 2 && 'AI Generates Content'}
                {step === 3 && 'Customize Your Design'}
                {step === 4 && 'Download & Apply'}
              </Typography>
              <Typography variant="body1" className="step-description">
                {step === 1 && 'Fill in basic information or import from LinkedIn'}
                {step === 2 && 'Our AI crafts professional content tailored to your field'}
                {step === 3 && 'Choose from 25+ templates and customize colors/fonts'}
                {step === 4 && 'Download as PDF or share directly with employers'}
              </Typography>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Typography variant="h2" className="section-title">
          Why <span className="text-red">Thousands</span> Choose ResumeAI
        </Typography>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              style={{ borderTop: `4px solid ${feature.color}` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <Typography variant="h3" className="feature-title">
                {feature.title}
              </Typography>
              <Typography variant="body1" className="feature-description">
                {feature.description}
              </Typography>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <Typography variant="h2" className="section-title">
          Success <span className="text-blue">Stories</span>
        </Typography>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="testimonial-content">
                <Typography variant="body1" className="testimonial-quote">
                  "{testimonial.quote}"
                </Typography>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.author} className="avatar" />
                  <Typography variant="subtitle1">{testimonial.author}</Typography>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <Typography variant="h2" className="cta-title">
          Ready to Build Your <span className="text-red">Perfect</span> Resume?
        </Typography>
        <Typography variant="subtitle1" className="cta-subtitle">
          Join thousands who landed their dream job with ResumeAI
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/builder')}
          className="cta-button"
        >
          Get Started for Free
        </Button>
      </section>
    </div>
  );
};

export default Home;