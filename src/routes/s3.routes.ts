import { uploadToS3Controller } from '@controllers/s3.controller.js';
import { asyncHandler } from '@utils/asyncHandler.js';
import { Router } from 'express';

const router: Router = Router();

router.post('/upload', asyncHandler(uploadToS3Controller));

export default router;
