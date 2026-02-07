import express, { Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (res: Response) => {
  res.send('🚀 Hello from Express + TypeScript + TSX!');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
