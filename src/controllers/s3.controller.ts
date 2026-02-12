import {
  generatePresignedUrl,
  enforceUploadRateLimit,
} from '@services/s3.services.js';

import { successResponse } from '@utils/apiResponse.js';
import { Request, Response } from 'express';

export const uploadToS3Controller = async (req: Request, res: Response) => {
  await enforceUploadRateLimit(req);

  const { presignedUrl, key } = await generatePresignedUrl(req.body);

  res.json(
    successResponse('Upload URL generated successfully', {
      presignedUrl,
      key,
    })
  );
};
