// controllers/aiController.js
const { callHF } = require('../services/hfService');

/**
 * POST /api/ai/generate-resume
 * body: {
 *   name: string,
 *   title: string,
 *   experience: [{ company, title, start, end, bullets[] }] (optional)
 *   skills: [string] (optional)
 *   education: [{ degree, institute, year }] (optional)
 *   targetRole: string (optional) - job title to optimize for
 * }
 */
const generateResume = async (req, res) => {
  try {
    const payload = req.body || {};
    const {
      name = 'John Doe',
      title = 'Software Engineer',
      experience = [],
      skills = [],
      education = [],
      targetRole = title
    } = payload;

    // Build instruction prompt that asks model to return valid JSON only
    const prompt = `
You are a professional resume writer. 
Create an ATS-friendly, concise resume JSON for the candidate described below.
Return ONLY valid JSON (no extra commentary). The JSON schema must be:

{
  "name": string,
  "title": string,
  "summary": string,
  "experiences": [
    { "company": string, "title": string, "start": string, "end": string, "bullets": [string] }
  ],
  "skills": [string],
  "education": [
    { "degree": string, "institute": string, "year": string }
  ],
  "keywords": [string]  // keywords relevant for ATS matching
}

Candidate data:
Name: ${name}
Current title: ${title}
Target role: ${targetRole}
Skills: ${skills.length ? skills.join(', ') : 'Not provided'}
Education: ${education.length ? JSON.stringify(education) : 'Not provided'}
Experience entries: ${experience.length ? JSON.stringify(experience) : 'Not provided'}

Make summary 2-3 sentences focusing on achievements and metrics if possible.
Choose keywords that recruiters would search for (return as array).
Use short action-oriented bullets for experiences.
Make output compact and valid JSON.
    `.trim();

    const modelOutput = await callHF(prompt, { max_new_tokens: 600, temperature: 0.3 });

    // Model should return JSON - try to parse
    let parsed;
    try {
      parsed = JSON.parse(modelOutput);
    } catch (e) {
      // If model returned extra text, try to extract first JSON block
      const jsonMatch = modelOutput.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1]);
      } else {
        // fallback: return raw text
        return res.status(200).json({ ok: false, raw: modelOutput, message: 'Model output not valid JSON' });
      }
    }

    return res.status(200).json({ ok: true, resume: parsed });
  } catch (err) {
    console.error('generateResume error', err.message || err);
    return res.status(500).json({ ok: false, error: 'Failed to generate resume' });
  }
};

/**
 * POST /api/ai/ats-check
 * body: {
 *   resumeText: string  OR resumeFields: {...}, 
 *   jobDescription: string
 * }
 * returns {score: number 0-100, missingKeywords: [string], suggestions: [string]}
 */
const atsCheck = async (req, res) => {
  try {
    const { resumeText = '', resumeFields = null, jobDescription = '' } = req.body;
    if (!jobDescription) return res.status(400).json({ ok: false, error: 'jobDescription required' });

    // Build prompt: compare resume and job description, return JSON
    const resumeForPrompt = resumeFields ? JSON.stringify(resumeFields) : resumeText;

    const prompt = `
You are an expert recruiter and ATS consultant. Compare the candidate resume below with the Job Description.
Return ONLY valid JSON with fields:
{
  "score": number, // 0-100
  "matchPercentage": number, // synonyms allowed but similar to score
  "missingKeywords": [string],
  "topMatchedKeywords": [string],
  "suggestions": [string] // actionable suggestions for resume improvement (3-6 items)
}

Job Description:
${jobDescription}

Resume:
${resumeForPrompt}

Instructions:
- Compute score 0-100 based on keyword match, role fit, and formatting suggestions.
- List missing keywords that appear in JD but not in resume.
- Provide short actionable suggestions tailored to the resume (use bullets).
- Return valid JSON only.
    `.trim();

    const modelOutput = await callHF(prompt, { max_new_tokens: 400, temperature: 0.2 });

    // try parse JSON
    let parsed;
    try {
      parsed = JSON.parse(modelOutput);
    } catch (e) {
      const jsonMatch = modelOutput.match(/(\{[\s\S]*\})/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[1]);
      else return res.status(200).json({ ok: false, raw: modelOutput, message: 'Model output not valid JSON' });
    }

    return res.status(200).json({ ok: true, result: parsed });
  } catch (err) {
    console.error('atsCheck error', err.response?.data || err.message || err);
    return res.status(500).json({ ok: false, error: 'Failed to run ATS check' });
  }
};

module.exports = { generateResume, atsCheck };
