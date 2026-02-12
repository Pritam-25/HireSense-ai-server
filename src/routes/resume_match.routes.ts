import { resumeMatchController } from '@controllers/index.js';
import { validateSchema } from '@middleware/index.js';
import { resumeMatchSchema } from '@schemas/resume_match.schema.js';
import { asyncHandler } from '@utils/asyncHandler.js';
import { Router } from 'express';

const router: Router = Router();

router.post(
  '/',
  validateSchema(resumeMatchSchema),
  asyncHandler(resumeMatchController)
);

export default router;
