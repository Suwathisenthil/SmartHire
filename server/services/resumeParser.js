const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { extractSkills, extractMetadata } = require('./skillExtractor');

/**
 * Parses uploaded resume file (PDF or DOCX) locally without any external APIs.
 * @param {string} filePath - Absolute or relative path to file
 * @param {string} fileType - 'pdf' or 'docx'
 * @returns {Promise<{ text: string, skills: string[], metadata: object }>}
 */
async function parseResumeFile(filePath, fileType) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    let rawText = '';

    if (fileType === 'pdf') {
      const data = await pdf(fileBuffer);
      rawText = data.text || '';
    } else if (fileType === 'docx') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      rawText = result.value || '';
    } else {
      throw new Error(`Unsupported file type: ${fileType}. Only PDF and DOCX are supported.`);
    }

    // Clean whitespace
    const cleanText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Extract skills and metadata
    const skills = extractSkills(cleanText);
    const metadata = extractMetadata(cleanText);

    return {
      text: cleanText,
      skills,
      metadata
    };
  } catch (error) {
    console.error(`[Resume Parser Error] Failed to parse ${filePath}:`, error.message);
    throw new Error(`Resume parsing failed: ${error.message}`);
  }
}

module.exports = {
  parseResumeFile
};
