import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AISuggestions = ({ field, userInput, onSelectSuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch AI suggestions from OpenAI GPT-4o via backend
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!userInput) return;
      setLoading(true);
      try {
        const response = await axios.post('/api/ai-suggestions', {
          field,
          input: userInput,
        });
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error('Error fetching AI suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [userInput, field]);

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
      <h3 className="text-lg font-semibold text-white">AI Suggestions for {field}</h3>
      {loading ? (
        <p className="text-white">Generating suggestions...</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 bg-white bg-opacity-20 rounded cursor-pointer hover:bg-opacity-30 text-white"
              onClick={() => onSelectSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AISuggestions;