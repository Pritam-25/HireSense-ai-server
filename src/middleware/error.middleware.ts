import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@utils/apiError.js';
import { errorResponse } from '@utils/apiResponse.js';
import { ZodError } from 'zod';
import { ERROR_CODES } from '@utils/errorCodes.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json(errorResponse(ERROR_CODES.VALIDATION_ERROR, err.message));
  }

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(errorResponse(err.errorCode, err.name));
  }

  // unknown error
  console.error(err);

  return res
    .status(500)
    .json(errorResponse(ERROR_CODES.INTERNAL_ERROR, err.name));
};

// for frontend
/*
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return {
      success: false,
      error:
        error?.response?.data?.error ||
        "Something went wrong",
    };
  }
);

*/
