import express from 'express';
import dummyRoute from './routes/dummyRoute.js';

const app = express();
const port = process.env.PORT || 3000;

app.use('/', dummyRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
