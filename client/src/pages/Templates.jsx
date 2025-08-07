import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import TemplateCard from '../components/templates/TemplateCard';
import TemplatePreviewModal from '../components/templates/TemplatePreviewModal';
import '../styles/Templates.css';

// Sample template data
const TEMPLATES = [
  {
    id: 'modern-red',
    name: 'Modern Red',
    category: 'Professional',
    thumbnail: '/templates/modern-red.jpg',
    premium: false,
    colors: ['#ff3e3e', '#ffffff', '#0f172a'],
    tags: ['ATS-Friendly', 'Minimalist']
  },
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    category: 'Professional',
    thumbnail: '/templates/classic-blue.jpg',
    premium: true,
    colors: ['#3e6bff', '#ffffff', '#1e293b'],
    tags: ['Traditional', 'Elegant']
  },
  {
    id: 'ats-optimized',
    name: 'ATS Optimized',
    category: 'ATS',
    thumbnail: '/templates/ats-optimized.jpg',
    premium: false,
    colors: ['#334155', '#f8fafc', '#3e6bff'],
    tags: ['Applicant Tracking', 'Clean']
  },
  // Add more templates...
];

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Filter templates based on category and search
  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = filter === 'all' || template.category.toLowerCase() === filter;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    // Simulate loading templates from API
    const timer = setTimeout(() => setIsLoading(false), 1000);
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
      {/* 3D Background Element */}
      <div className="templates-bg">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
          <Environment preset="city" />
          <mesh position={[0, 0, 0]}>
            <torusGeometry args={[3, 0.5, 16, 100]} />
            <meshStandardMaterial color="#3e6bff" metalness={0.7} roughness={0.2} />
          </mesh>
        </Canvas>
      </div>

      <div className="templates-container">
        <motion.div 
          className="templates-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>
            <span className="text-red">Resume</span>
            <span className="text-blue">AI</span> Templates
          </h1>
          <p className="subtitle">Choose from our professionally designed templates</p>
          
          <div className="templates-controls">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="search-icon">{/* Search icon */}</svg>
            </div>
            
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active btn-blue' : 'btn-outline-blue'}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={filter === 'professional' ? 'active btn-red' : 'btn-outline-red'}
                onClick={() => setFilter('professional')}
              >
                Professional
              </button>
              <button 
                className={filter === 'ats' ? 'active btn-blue' : 'btn-outline-blue'}
                onClick={() => setFilter('ats')}
              >
                ATS
              </button>
              <button 
                className={filter === 'creative' ? 'active btn-red' : 'btn-outline-red'}
                onClick={() => setFilter('creative')}
              >
                Creative
              </button>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="template-skeleton"></div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="templates-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <TemplateCard 
                  template={template} 
                  onSelect={openPreview}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {selectedTemplate && (
        <TemplatePreviewModal 
          template={selectedTemplate}
          onClose={closePreview}
        />
      )}
    </div>
  );
};

export default Templates;