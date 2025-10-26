// import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize('hng_stage_2', 'root', 'root', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

// export default sequelize;

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,

  // Connection pool settings
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 60000,
  },

  // Retry configuration
  retry: {
    max: 3,
  },

  // Connection timeout
  dialectOptions: {
    connectTimeout: 60000,
  },

  // Logging (set to false in production)
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Test connection and add event handlers
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Implement retry logic or exit process
    process.exit(1);
  }
}

// Initialize the database connection
initializeDatabase();

export default sequelize;
