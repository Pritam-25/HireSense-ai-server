import { uploadSchema } from '@schemas/index.js';
import {
  generatePresignedUrl,
  enforceUploadRateLimit,
} from '@services/s3.services.js';
import { ApiError } from '@utils/apiError.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { successResponse } from '@utils/apiResponse.js';
import { Request, Response } from 'express';

export const uploadToS3Controller = async (req: Request, res: Response) => {
  await enforceUploadRateLimit(req);

  const parsedBody = uploadSchema.safeParse(req.body);
  if (!parsedBody.success) {
    throw new ApiError(400, ERROR_CODES.VALIDATION_ERROR);
  }

  const { presignedUrl, key } = await generatePresignedUrl(parsedBody.data);

  res.json(
    successResponse('Upload URL generated successfully', {
      presignedUrl,
      key,
    })
  );
};
