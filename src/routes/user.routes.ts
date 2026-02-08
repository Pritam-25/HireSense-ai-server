import { getUserDetailsController } from '@controllers/user.controller.js';
import { asyncHandler } from '@utils/asyncHandler.js';
import { Router } from 'express';

const router: Router = Router();

router.get('/', asyncHandler(getUserDetailsController));

export default router;
