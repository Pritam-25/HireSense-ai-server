import 'dotenv/config';
import express, { Express, Router } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { errorHandler } from '@middleware/error.middleware.js';
import { requireAuth } from '@middleware/auth.middleware.js';
import { userRoutes, webhookRouter } from '@routes/index.js';

const app: Express = express();
const apiRouter: Router = Router();

app.use(express.json());

// clerk middleware (session parsing)
app.use(clerkMiddleware());

// Webhook endpoint (no auth)
app.use('/api/webhooks/clerk', webhookRouter);

// API routes (all protected)
apiRouter.use('/user', userRoutes);
app.use('/api', requireAuth, apiRouter);

// error handling middleware (must be last )
app.use(errorHandler);

export default app;
