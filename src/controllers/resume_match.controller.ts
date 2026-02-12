import { resumeMatchService } from '@services/index.js';
import { successResponse } from '@utils/apiResponse.js';
import { Request, Response } from 'express';

export const resumeMatchController = async (req: Request, res: Response) => {
  await resumeMatchService(req.body);
  res.json(successResponse('Resume match processed successfully'));
};
