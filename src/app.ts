import 'dotenv/config';
import express, { Express, Router } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { errorHandler } from '@middleware/index.js';
import { requireAuth } from '@middleware/index.js';
import { userRoutes, webhookRouter, s3Routes } from '@routes/index.js';
import cors from 'cors';
import { arcjetMiddleware } from '@infra/security/arcjet.js';

const app: Express = express();
app.use(express.json());

const apiRouter: Router = Router();

app.use(
  cors({
    origin: 'http://localhost:3000', // your Next.js frontend
    credentials: true,
  })
);

// clerk middleware (session parsing)
app.use(clerkMiddleware());

// Webhook endpoint (no auth)
app.use('/api/webhooks/clerk', webhookRouter);

// API routes (all protected)
apiRouter.use('/user', userRoutes);
apiRouter.use('/s3', s3Routes);

app.post('/api/debug', (req, res) => {
  console.log('BODY:', req.body);
  res.json(req.body);
});

app.use('/api', requireAuth, arcjetMiddleware, apiRouter);

// error handling middleware (must be last )
app.use(errorHandler);

export default app;
