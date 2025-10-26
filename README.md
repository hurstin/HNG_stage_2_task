# HNG Stage 2 Task - Country Data API

This project provides an API to fetch, store, and manage country data, including population, capital, region, currency, and estimated GDP. It also generates a summary image of the data.

## Features

- Fetch country data from an external API.
- Fetch exchange rates from an external API.
- Store and update country data in a MySQL database.
- Filter countries by region and currency.
- Sort countries by estimated GDP.
- Generate a summary image of the top 5 countries by GDP.
- Refresh country data on demand.
- Delete country data by name.
- Get API status (total countries, last refreshed at).

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- MySQL Database
- Docker (optional, for running MySQL via docker-compose)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/hng-stage-2-task.git
cd hng-stage-2-task
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```
PORT=3000
DB_NAME=hng_stage_2
DB_USER=root
DB_PASS=root
DB_HOST=localhost
DB_DIALECT=mysql
```

**Note:** You can change the values as per your MySQL setup.

### 4. Database Setup

#### Using Docker (Recommended)

If you have Docker installed, you can use the provided `docker-compose.yml` to set up a MySQL database:

```bash
docker-compose up -d
```

This will start a MySQL container. The database will be accessible at `localhost:3306` with the credentials specified in your `.env` file.

#### Manual MySQL Setup

1. Ensure you have a MySQL server running.
2. Create a database named `hng_stage_2` (or whatever you specified in `DB_NAME` in your `.env` file).
3. Ensure the `DB_USER` and `DB_PASS` in your `.env` file have appropriate permissions to access this database.

### 5. Run the Application

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

- `GET /dummy`: Returns the number of countries fetched from the external API.
- `GET /countries`: Get all countries. Supports `region`, `currency`, and `sort=gdp_desc` query parameters.
- `POST /countries/refresh`: Refreshes country data from external APIs and updates the database. This also regenerates the summary image.
- `GET /countries/image`: Serves the generated summary image.
- `GET /countries/:name`: Get a single country by name.
- `DELETE /countries/:name`: Delete a country by name.
- `GET /status`: Get the total number of countries and the last refresh timestamp.

## Caching Strategy

Country data is stored in a MySQL database. The data is refreshed and the summary image is regenerated only when the `/countries/refresh` endpoint is explicitly called. This ensures that the cache is updated on demand.

## JSON Responses

All API endpoints return responses in JSON format.

## Project Structure

```
.
├── app.js                  # Main application file
├── db.js                   # Database connection and initialization
├── controllers/
│   └── controller.js       # API logic and data handling
├── models/
│   └── Country.js          # Sequelize model for Country
├── routes/
│   └── route.js            # API routes definitions
├── utils/
│   └── imageGenerator.js   # Utility for generating summary image
├── cache/
│   └── summary.png         # Generated summary image (cached)
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lock file
├── docker-compose.yml      # Docker Compose for MySQL
└── README.md               # Project README
```
