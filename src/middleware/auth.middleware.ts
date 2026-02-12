import { getAuth } from '@clerk/express';
import prisma from 'src/config/db/prisma.js';
import { ApiError } from '@utils/apiError.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { Request, Response, NextFunction } from 'express';

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { isAuthenticated, userId } = getAuth(req);

  console.log('Authentication check:', { isAuthenticated, userId });
  if (!isAuthenticated) {
    throw new ApiError(401, ERROR_CODES.NOT_AUTHENTICATED);
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    throw new ApiError(404, ERROR_CODES.USER_NOT_FOUND);
  }

  req.userId = user.id; // attach internal user ID to request for downstream handlers
  next();
};
