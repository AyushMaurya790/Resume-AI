import React, { useState } from 'react';
import Link from 'next/link';

const templates = [
  { id: 1, name: 'Modern', thumbnail: '/images/templates/modern.png', type: 'Modern', description: 'Sleek and contemporary design' },
  { id: 2, name: 'Classic', thumbnail: '/images/templates/classic.png', type: 'Classic', description: 'Timeless and professional layout' },
  { id: 3, name: 'ATS', thumbnail: '/images/templates/ats.png', type: 'ATS', description: 'Optimized for applicant tracking systems' },
  // Add more templates as needed (up to 25+)
];

const TemplateGallery = () => {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">
          Choose Your Resume Template
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 ${
                hoveredTemplate === template.id ? 'scale-105 rotate-1' : 'scale-100'
              } hover:shadow-2xl hover:-translate-y-2`}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-blue-900">{template.name}</h2>
                <p className="text-gray-600 mt-2">{template.description}</p>
                <p className="text-sm text-red-600 font-medium mt-1">{template.type}</p>
                <Link href={`/builder?template=${template.id}`}>
                  <button className="mt-4 w-full bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-red-600 hover:to-blue-600 transition-colors duration-300">
                    Select Template
                  </button>
                </Link>
              </div>
              {hoveredTemplate === template.id && (
                <div className="absolute inset-0 bg-blue-900 bg-opacity-20 flex items-center justify-center transition-opacity duration-300">
                  <span className="text-white text-lg font-bold">Preview</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;