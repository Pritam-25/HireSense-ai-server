import { ZodType } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '@utils/apiResponse.js';

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      res
        .status(400)
        .json(errorResponse('Request body is required', 'No body provided'));
      return;
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors: Record<string, string> = {};

      result.error.issues.forEach(issue => {
        const field = issue.path.join('.');
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      });

      console.log('Errors before response:', errors);
      return res
        .status(400)
        .json(errorResponse('Invalid request data', errors));
    }

    // overwrite with validated data
    req.body = result.data;

    return next();
  };
