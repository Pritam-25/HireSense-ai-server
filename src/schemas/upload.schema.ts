import { z } from 'zod';

export const uploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  contentType: z.string().min(1, 'Content type is required'),
  size: z.number().max(5 * 1024 * 1024, 'File size must be less than 5MB'),
});
