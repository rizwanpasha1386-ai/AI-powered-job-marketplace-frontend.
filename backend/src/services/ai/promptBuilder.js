/**
 * Utility to generate structured prompts for the AI model.
 * Separating this allows for easy versioning of prompts without touching business logic.
 */
export const buildTrustSummaryPrompt = (employeeData) => {
  const {
    skills,
    experience,
    education,
    availabilityStatus,
    completedJobs,
    recruiterRatings,
    punctualityScore
  } = employeeData;

  return `
    Analyze the following employee profile and generate a professional trust summary.
    
    Candidate Data:
    - Skills: ${skills && skills.length > 0 ? skills.join(', ') : 'None listed'}
    - Experience: ${experience ? experience.length : 0} roles listed
    - Education: ${education ? education.length : 0} degrees listed
    - Availability: ${availabilityStatus}
    
    Performance Metrics:
    - Completed Jobs: ${completedJobs || 0}
    - Recruiter Ratings: ${recruiterRatings || 'N/A'} / 5.0
    - Punctuality Score: ${punctualityScore || 'N/A'}%

    Task:
    Provide an objective assessment of the candidate based on the provided metrics.
    
    Return EXACTLY a JSON object with the following schema:
    {
      "professionalSummary": "A 2-3 sentence professional overview",
      "trustLevel": "High | Medium | Low",
      "communicationBehavior": "Assessment of expected communication",
      "reliabilityAnalysis": "Analysis of their punctuality and completion rates"
    }
  `;
};
