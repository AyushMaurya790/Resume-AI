const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

const app = express();

// ✅ Debug env vars (hide sensitive ones)
console.log('Environment Variables:', {
  HF_MODEL: process.env.HF_MODEL,
  HF_API_KEY: process.env.HF_API_KEY ? 'Set' : 'Not set',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY ? 'Set' : 'Not set'
});

// ✅ Load Firebase Service Account
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:", err);
    process.exit(1);
  }
} else {
  try {
    serviceAccount = require('./config/firebase-service-account.json');
  } catch (err) {
    console.error("❌ Firebase service account file not found locally:", err);
    process.exit(1);
  }
}

// ✅ Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'resume-ai-a2edc.appspot.com',
});

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes Import
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

// ✅ Routes Use
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// ✅ OpenAI Haiku API
app.post('/api/haiku', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'Prompt is required and must be a string' });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: 'OPENAI_API_KEY is missing' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates haikus.' },
          { role: 'user', content: prompt }
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

// ✅ HuggingFace Inference API
app.post('/api/huggingface', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ message: 'Prompt is required and must be a string' });
    }
    if (!process.env.HF_API_KEY) {
      return res.status(500).json({ message: 'HuggingFace API key is missing' });
    }
    if (!process.env.HF_MODEL) {
      return res.status(500).json({ message: 'HuggingFace model is not specified' });
    }

    console.log(`📡 HuggingFace request with model: ${process.env.HF_MODEL}`);

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${process.env.HF_MODEL}`,
      {
        inputs: prompt,
        parameters: { max_length: 100, return_full_text: false },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

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
      return res.status(404).json({ message: `Model "${process.env.HF_MODEL}" not found or inaccessible.` });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ message: 'HuggingFace API rate limit exceeded.' });
    }
    if (error.response?.status === 401) {
      return res.status(401).json({ message: 'Invalid HuggingFace API key.' });
    }

    res.status(500).json({ message: 'HuggingFace API request failed', error: error.response?.data || error.message });
  }
});

// ✅ Gemini API
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY not set in environment variables");
}
const geminiAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ message: "Prompt is required and must be a string" });
    }

    const model = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    res.json({
      prompt,
      response: result.response.text(),
    });
  } catch (error) {
    console.error("❌ Gemini API Error:", {
      message: error.message,
      response: error.response?.data,
    });
    res.status(500).json({ message: "Gemini API request failed", error: error.message });
  }
});

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Resume AI Backend is running 🚀');
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
