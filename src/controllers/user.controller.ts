// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { errorResponse, successResponse } from '@utils/apiResponse.js';
import { getUserDetailsService } from '@services/user.service.js';
import { verifyWebhook } from '@clerk/express/webhooks';
import { env } from '@utils/env.js';
import * as userService from '@services/user.service.js';

export const getUserDetailsController = async (req: Request, res: Response) => {
  const userId = req.userId; // from auth middleware
  const user = await getUserDetailsService(userId);

  res.json(successResponse('User details retrieved successfully', user));
};

export const clerkWebhookController = async (req: Request, res: Response) => {
  const isDev = env.NODE_ENV !== 'production';

  try {
    const evt = await verifyWebhook(req, {
      signingSecret: env.CLERK_WEBHOOK_SECRET,
    });

    if (isDev) {
      console.log('Webhook verified:', evt.type);
      console.log('Event data:', evt.data);
    }

    switch (evt.type) {
      case 'user.created':
        await userService.handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await userService.handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await userService.handleUserDeleted(evt.data);
        break;
    }

    if (isDev) console.log('Webhook processed');

    res.status(200).send(successResponse('Webhook processed successfully'));
  } catch (err) {
    if (isDev) console.error('Webhook verification failed:', err);
    res
      .status(400)
      .send(
        errorResponse(
          'Invalid webhook',
          err instanceof Error ? err.message : 'Unknown error'
        )
      );
  }
};
