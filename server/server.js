const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

// Debug environment variables
console.log('Environment Variables:', {
  HF_MODEL: process.env.HF_MODEL,
  HF_API_KEY: process.env.HF_API_KEY ? 'Set' : 'Not set',
});

// Firebase Service Account
const serviceAccount = require('./config/firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'resume-ai-a2edc.appspot.com',
});

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes Import
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Routes Use
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// ✅ OpenAI Haiku API (unchanged)
app.post('/api/haiku', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'Prompt is required and must be a string' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates haikus.' },
          { role: 'user', content: prompt || 'Write a haiku about AI' },
        ],
        max_tokens: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    res.json({ haiku: response.data.choices[0].message.content });
  } catch (error) {
    console.error('❌ OpenAI API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    res.status(500).json({ message: 'OpenAI API request failed', error: error.response?.data || error.message });
  }
});

// ✅ HuggingFace Inference API (Text Generation)
app.post('/api/huggingface', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'Prompt is required and must be a string' });
    }

    // Validate environment variables
    if (!process.env.HF_API_KEY) {
      return res.status(500).json({ message: 'HuggingFace API key is missing' });
    }
    if (!process.env.HF_MODEL) {
      return res.status(500).json({ message: 'HuggingFace model is not specified' });
    }

    console.log(`Attempting HuggingFace API request with model: ${process.env.HF_MODEL}`);

    // Fallback model if primary model fails
    const models = [process.env.HF_MODEL, 'distilgpt2']; // Fallback to distilgpt2
    let response;
    let lastError;

    for (const model of models) {
      console.log(`Trying model: ${model}`);
      try {
        response = await axios.post(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            inputs: prompt,
            parameters: {
              max_length: 100,
              return_full_text: false,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_API_KEY}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          }
        );
        console.log(`Success with model: ${model}`);
        break; // Exit loop on success
      } catch (err) {
        lastError = err;
        console.error(`Failed with model ${model}:`, {
          message: err.message,
          status: err.response?.status,
          response: err.response?.data,
        });
        if (err.response?.status !== 404) {
          throw err; // Throw non-404 errors immediately
        }
      }
    }

    if (!response) {
      throw lastError; // Throw the last error if all models fail
    }

    // Check if response data is valid
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      res.json({ generated_text: response.data[0].generated_text });
    } else {
      res.status(500).json({ message: 'Invalid response from HuggingFace API' });
    }
  } catch (error) {
    console.error('❌ HuggingFace API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      model: process.env.HF_MODEL,
    });

    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'Model not found or inaccessible. Check model ID or access permissions.' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ message: 'HuggingFace API rate limit exceeded. Try again later or upgrade your plan.' });
    }
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid HuggingFace API key. Please verify your API token.' });
    }

    res.status(500).json({ message: 'HuggingFace API request failed', error: error.response?.data || error.message });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Resume AI Backend is running 🚀');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});