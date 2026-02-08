import { Request, Response } from 'express';
import app from './app.js';
import { env } from './utils/env.js';

const PORT = env.PORT || 3000;

app.get('/', (_req: Request, res: Response) => {
  res.send('👋 Hello from HireSense');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
