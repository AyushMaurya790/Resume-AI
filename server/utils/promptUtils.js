function generatePrompt({ name, education, skills, experience }) {
  return `
Generate a professional resume summary with the following details:

Name: ${name}
Education: ${education}
Skills: ${skills?.join(', ')}
Experience: ${experience}

Make the summary concise, well-structured, and job-ready.
  `;
}

module.exports = { generatePrompt };
