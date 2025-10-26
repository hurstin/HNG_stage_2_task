import express from 'express';
import dummyRoute from './routes/route.js';
import sequelize from './db.js';

const app = express();
const port = process.env.PORT || 3000;

app.use('/', dummyRoute);

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database connected and synced');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
