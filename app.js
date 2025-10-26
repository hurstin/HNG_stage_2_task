import express from 'express';
import dummyRoute from './routes/dummyRoute.js';

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use('/', dummyRoute);

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.listen(port, async () => {
  try {
    await prisma.$connect();
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
  }
  console.log(`Server is running on port ${port}`);
});
