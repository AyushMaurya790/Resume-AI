import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Helmet } from 'react-helmet';
import TemplateCard from '../components/templates/TemplateCard';
import TemplatePreviewModal from '../components/templates/TemplatePreviewModal';
import '../styles/Templates.css';

// Sample template data with AI-driven metadata
const TEMPLATES = [
  {
    id: 'modern-red',
    name: 'Modern Red',
    category: 'Professional',
    thumbnail: '/templates/modern-red.jpg',
    premium: false,
    colors: ['#ff3e3e', '#ffffff', '#0f172a'],
    tags: ['ATS-Friendly', 'Minimalist'],
    aiScore: 85, // AI-generated template suitability score
    jobMatch: ['Software Engineer', 'Product Manager'],
  },
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    category: 'Professional',
    thumbnail: '/templates/classic-blue.jpg',
    premium: true,
    colors: ['#3e6bff', '#ffffff', '#1e293b'],
    tags: ['Traditional', 'Elegant'],
    aiScore: 90,
    jobMatch: ['Finance', 'Consulting'],
  },
  {
    id: 'ats-optimized',
    name: 'ATS Optimized',
    category: 'ATS',
    thumbnail: '/templates/ats-optimized.jpg',
    premium: false,
    colors: ['#334155', '#f8fafc', '#3e6bff'],
    tags: ['Applicant Tracking', 'Clean'],
    aiScore: 95,
    jobMatch: ['Data Analyst', 'HR'],
  },
];

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Filter templates based on category, search, and AI suggestions
  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCategory = filter === 'all' || template.category.toLowerCase() === filter;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      template.jobMatch.some((job) => job.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Simulate AI-driven template recommendation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Mock AI suggestion based on user profile (e.g., from ResumeContext)
      const suggestedTemplate = TEMPLATES.reduce((prev, curr) =>
        prev.aiScore > curr.aiScore ? prev : curr
      );
      setAiSuggestion(suggestedTemplate);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const openPreview = (template) => {
    setSelectedTemplate(template);
  };

  const closePreview = () => {
    setSelectedTemplate(null);
  };

  return (
    <div className="templates-page">
      {/* SEO Optimization */}
      <Helmet>
        <title>ResumeAI - Professional Resume Templates</title>
        <meta
          name="description"
          content="Explore 25+ professional, ATS-friendly resume templates with real-time previews. Build your perfect resume with ResumeAI's AI-driven tools."
        />
        <meta name="keywords" content="resume templates, ATS-friendly, professional resumes, ResumeAI" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'ResumeAI Templates',
            description: 'Choose from professional and ATS-optimized resume templates.',
            url: window.location.href,
          })}
        </script>
      </Helmet>

      {/* 3D Background with Subtle Animation */}
      <div className="templates-bg">
        <Canvas>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
          <Environment preset="sunset" />
          <motion.mesh
            position={[0, 0, 0]}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <torusKnotGeometry args={[2, 0.5, 100, 16]} />
            <meshStandardMaterial color="#3e6bff" metalness={0.8} roughness={0.1} />
          </motion.mesh>
        </Canvas>
      </div>

      <div className="templates-container">
        <motion.div
          className="templates-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1>
            <span className="text-red">Resume</span>
            <span className="text-blue">AI</span> Templates
          </h1>
          <p className="subtitle">Craft your perfect resume with AI-driven templates</p>

          {aiSuggestion && (
            <motion.div
              className="ai-suggestion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p>
                <strong>AI Recommendation:</strong> Try the "{aiSuggestion.name}" template for{' '}
                {aiSuggestion.jobMatch.join(' or ')} roles (Score: {aiSuggestion.aiScore}%).
              </p>
            </motion.div>
          )}

          <div className="templates-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search templates by name, tag, or job role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search resume templates"
              />
              <svg className="search-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                />
              </svg>
            </div>

            <div className="filter-buttons">
              {['all', 'professional', 'ats', 'creative'].map((category) => (
                <motion.button
                  key={category}
                  className={filter === category ? `active btn-${category === 'professional' || category === 'creative' ? 'red' : 'blue'}` : `btn-outline-${category === 'professional' || category === 'creative' ? 'red' : 'blue'}`}
                  onClick={() => setFilter(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="template-skeleton"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="templates-grid"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
          >
            <AnimatePresence>
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ y: -10, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
                  transition={{ duration: 0.3 }}
                >
                  <TemplateCard template={template} onSelect={openPreview} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedTemplate && (
          <TemplatePreviewModal template={selectedTemplate} onClose={closePreview} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Templates;