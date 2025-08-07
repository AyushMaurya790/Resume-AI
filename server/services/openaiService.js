const OpenAI = require('openai');
const { resumePromptGenerator } = require('../utils/promptUtils');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateResumeContent = async (userData, jobDescription = '') => {
  try {
    const prompt = resumePromptGenerator(userData, jobDescription);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional resume builder assistant. Generate well-structured, professional resume content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate resume content');
  }
};

exports.generateCoverLetter = async (resumeData, jobDescription) => {
  // Similar implementation for cover letter generation
};