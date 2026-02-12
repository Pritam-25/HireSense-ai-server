import { Request, Response } from 'express';
import app from './app.js';
import { env } from './utils/env.js';
import prisma from 'src/config/db/prisma.js';

const PORT = env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('👋 Hello from HireSense');
});

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`; // example DB check

    res.status(200).json({
      status: 'ok',
      db: 'connected',
      uptime: process.uptime(),
    });
  } catch {
    res.status(503).json({
      status: 'degraded',
      db: 'disconnected',
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
