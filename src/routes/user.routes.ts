import { getUserDetailsController } from '@controllers/user.controller.js';
import { loginSchema } from '@schemas/index.js';
import { validate } from '@middleware/validate.middleware.js';
import { asyncHandler } from '@utils/asyncHandler.js';
import { Router } from 'express';

const router: Router = Router();

router.get('/', asyncHandler(getUserDetailsController));

router.post('/login', validate(loginSchema), async (_req, res) => {
  res.json({ message: 'Login successful' });
});

export default router;
