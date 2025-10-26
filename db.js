import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'hng_stage_2',
};

let connection;

async function connectToDatabase() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
}

async function createTable() {
  try {
    if (!connection) {
      await connectToDatabase();
    }

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS countries (
        name VARCHAR(255) NOT NULL,
        capital VARCHAR(255),
        region VARCHAR(255),
        population INT,
        flag VARCHAR(255),
        currencies VARCHAR(255),
        estimated_gdp DECIMAL(20, 2),
        PRIMARY KEY (name)
      )
    `;

    await connection.execute(createTableQuery);
    console.log('Countries table created or already exists');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
}

export { connectToDatabase, createTable, dbConfig };
