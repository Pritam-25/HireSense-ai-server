import { z } from 'zod';

export enum WorkingMode {
  REMOTE = 'Remote',
  ONSITE = 'On-site',
  HYBRID = 'Hybrid',
}

export const resumeMatchSchema = z.object({
  jobTitle: z.string().min(3, 'Job title is required').max(100),
  jobDescription: z.string().min(10, 'Job description is required').max(5000),
  resumeFileKey: z.string().min(1, 'File key is required'),
  yearsOfExp: z.coerce
    .number({
      message: 'Years of experience is required',
    })
    .nonnegative('Years of experience cannot be negative')
    .max(50, 'Years of experience seems too high'),
  preferredLocation: z
    .string()
    .min(2, 'Preferred location is required')
    .max(100),
  workingMode: z.enum(WorkingMode),
  currentRole: z.string().optional(),
});

export type ResumeMatchParsedType = z.infer<typeof resumeMatchSchema>;
