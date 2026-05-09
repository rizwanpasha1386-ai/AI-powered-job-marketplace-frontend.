import { buildTrustSummaryPrompt } from './promptBuilder.js';

// Note: Future Gemini integration is pre-structured here.
// import { GoogleGenerativeAI } from '@google/generative-ai';
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Scalable service to generate an AI Trust Summary.
 * Currently uses rule-based mock logic as per MVP requirements,
 * but the architecture is ready to swap to real Gemini API calls.
 */
export const generateTrustSummary = async (employeeData) => {
  // 1. Build the prompt (Future-ready for Gemini execution)
  const prompt = buildTrustSummaryPrompt(employeeData);
  console.log("Future AI Prompt prepared:\n", prompt);

  // 2. Execute Mock Logic (Simulate network delay)
  await new Promise((resolve) => setTimeout(resolve, 600));

  let trustLevel = 'Medium';
  let reliabilityAnalysis = 'Average reliability based on limited data.';
  let communicationBehavior = 'Expected to have standard communication skills.';
  let professionalSummary = 'A candidate with potential, currently establishing their profile on the platform.';

  // Rule-based mock logic based on profile completeness and metrics
  const hasSkills = employeeData.skills && employeeData.skills.length > 0;
  const hasExperience = employeeData.experience && employeeData.experience.length > 0;
  const isHighlyRated = parseFloat(employeeData.recruiterRatings) >= 4.0;
  const isPunctual = parseInt(employeeData.punctualityScore, 10) >= 90;

  if (hasSkills && hasExperience && isHighlyRated && isPunctual) {
    trustLevel = 'High';
    reliabilityAnalysis = 'Highly reliable worker; consistently punctual and highly rated by previous recruiters.';
    communicationBehavior = 'Professional, highly responsive, and communicative.';
    professionalSummary = `Exceptional candidate highly skilled in ${employeeData.skills.slice(0, 2).join(', ')}. Demonstrated consistent top-tier performance.`;
  } else if (!hasSkills && !hasExperience) {
    trustLevel = 'Low';
    reliabilityAnalysis = 'Incomplete profile leads to lower confidence in reliability.';
    professionalSummary = 'Candidate profile lacks sufficient details for a comprehensive assessment.';
  } else if (hasSkills) {
    professionalSummary = `Skilled candidate with proficiency in ${employeeData.skills.join(', ')}.`;
  }

  // In the future, this JSON object will be extracted and parsed directly from the Gemini LLM response
  return {
    professionalSummary,
    trustLevel,
    communicationBehavior,
    reliabilityAnalysis
  };
};
