// import 'dotenv/config';
// import express from 'express';
// import dummyRoute from './routes/route.js';
// import sequelize from './db.js';

// const app = express();
// const port = process.env.PORT || 4000;

// app.use('/', dummyRoute);

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Database connection has been established successfully.');
//     return sequelize.sync();
//   })
//   .then(() => {
//     console.log('Database connected and synced');
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Unable to connect to the database:', err);
//   });

import 'dotenv/config';
import express from 'express';
import dummyRoute from './routes/route.js';
import sequelize from './db.js';

const app = express();
const port = process.env.PORT || 4000;

// Health check route for Leapcell
app.get('/kaithhealth', (req, res) => res.send('OK'));

// Your other routes
app.use('/', dummyRoute);

// Start server as soon as possible
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

  // Connect DB in background (optional: you can keep your original logic)
  sequelize
    .authenticate()
    .then(() => {
      console.log('Database connection has been established successfully.');
      return sequelize.sync();
    })
    .then(() => {
      console.log('Database connected and synced');
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    });
});
