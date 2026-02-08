import { clerkWebhookController } from '@controllers/user.controller.js';
import { Router } from 'express';

const router: Router = Router();

// Clerk webhook endpoint
router.post('/', clerkWebhookController);

export default router;
