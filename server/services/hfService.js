// services/hfService.js
const axios = require('axios');

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = process.env.HF_MODEL || 'meta-llama/Llama-3-8b-chat';
const HF_BASE = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

if (!HF_API_KEY) {
  console.warn('Warning: HF_API_KEY not set in .env - API calls will fail.');
}

async function callHF(prompt, options = {}) {
  // options may contain: max_new_tokens, temperature, top_k etc.
  try {
    const body = {
      inputs: prompt,
      parameters: {
        max_new_tokens: options.max_new_tokens || 512,
        temperature: options.temperature || 0.7,
        top_k: options.top_k || 50
      },
      options: { wait_for_model: true }
    };

    const res = await axios.post(HF_BASE, body, {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 120000 // 2 minutes
    });

    // Model returns different shapes; try to extract text
    const data = res.data;
    // If HF returns string with generated_text
    if (typeof data === 'string') return data;
    if (data.generated_text) return data.generated_text;
    // For some models it returns array
    if (Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text;
    // fallback
    return JSON.stringify(data);
  } catch (err) {
    console.error('HuggingFace service error:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { callHF };
