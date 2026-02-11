export const ERROR_CODES = {
  RESUME_NOT_FOUND: 'Resume not found',
  JOBS_NOT_FOUND: 'Jobs not found',
  NOT_AUTHENTICATED: 'User Not authenticated',
  USER_NOT_FOUND: 'User not found',
  FORBIDDEN: 'Forbidden',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  ARCJET: {
    BOT_DETECTED: 'Forbidden - Bot Detected',
    RATE_LIMIT: 'Too Many Requests',
    GENERIC: 'Forbidden',
  },
  FILE_UPLOAD_LIMIT: 'File upload limit exceeded. please try again later.',
} as const;
