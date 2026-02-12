import { ResumeMatchParsedType } from '@schemas/resume_match.schema.js';

export const resumeMatchService = async (data: ResumeMatchParsedType) => {
  console.log('Received resume match data:', data);
};
