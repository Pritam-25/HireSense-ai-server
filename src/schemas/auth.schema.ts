import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  age: z.coerce
    .number({
      message: 'Age is required',
    })
    .positive('Age must be a positive number')
    .max(120, 'Age seems too high'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
