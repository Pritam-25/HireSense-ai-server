import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { arcjetProtect } from 'src/config/security/arcjet.js';
import { s3Client } from 'src/config/storage/s3.client.js';
import { ApiError } from '@utils/apiError.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { env } from '@utils/env.js';

interface GeneratePresignedUrlInput {
  fileName: string;
  contentType: string;
}

export async function enforceUploadRateLimit(req: Request) {
  const decision = await arcjetProtect.protect(req, {
    fingerprint: req.userId,
  });

  if (decision.isDenied()) {
    if (decision.reason?.isRateLimit?.()) {
      throw new ApiError(429, ERROR_CODES.FILE_UPLOAD_LIMIT);
    }

    throw new ApiError(403, ERROR_CODES.ARCJET.GENERIC);
  }
}

export async function generatePresignedUrl(input: GeneratePresignedUrlInput) {
  const { fileName, contentType } = input;
  const uniqueFileName = `${Date.now()}-${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: uniqueFileName,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return {
    presignedUrl,
    key: uniqueFileName,
  };
}
