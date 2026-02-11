export const successResponse = (message: string, data?: unknown) => ({
  success: true,
  message,
  data,
});

export const errorResponse = (errorMsg: string, error: unknown) => ({
  success: false,
  message: errorMsg,
  error,
});
