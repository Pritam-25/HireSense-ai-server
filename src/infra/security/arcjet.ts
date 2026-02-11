import arcjet, { detectBot, fixedWindow, shield } from '@arcjet/node';
import { ApiError } from '@utils/apiError.js';
import { env } from '@utils/env.js';
import { ERROR_CODES } from '@utils/errorCodes.js';
import { NextFunction, Request, Response } from 'express';

export const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ['fingerprint'],
  rules: [
    shield({
      mode: 'LIVE',
    }),
    fixedWindow({
      mode: 'LIVE',
      window: '1m',
      max: 30,
    }),
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'POSTMAN'],
    }),
  ],
});

export const arcjetMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const decision = await aj.protect(req, {
    fingerprint: req.userId,
  });

  if (env.NODE_ENV !== 'production') {
    console.log('Arcjet decision:', decision);
  }

  if (decision.isDenied()) {
    if (decision.reason?.isBot?.()) {
      throw new ApiError(403, ERROR_CODES.ARCJET.BOT_DETECTED);
    }

    if (decision.reason?.isRateLimit?.()) {
      throw new ApiError(429, ERROR_CODES.ARCJET.RATE_LIMIT);
    }

    throw new ApiError(403, ERROR_CODES.ARCJET.GENERIC);
  }

  next();
};

export const arcjetProtect = aj.withRule(
  fixedWindow({ mode: 'LIVE', window: '1m', max: 10 })
);
