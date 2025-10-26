import axios from 'axios';
import Country from '../models/Country.js';
import sequelize from '../db.js';
import { Op } from 'sequelize';
import { generateSummaryImage } from '../utils/imageGenerator.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CACHE_DIR = path.join(__dirname, '..', 'cache');
const IMAGE_PATH = path.join(CACHE_DIR, 'summary.png');

const fetchCountryData = async () => {
  try {
    const response = await axios.get(
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error(
      'Error fetching country data from REST Countries API:',
      error.message
    );
    return {
      success: false,
      details: 'Could not fetch data from REST Countries API',
    };
  }
};

const fetchExchangeRates = async () => {
  try {
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    return { success: true, rates: response.data.rates };
  } catch (error) {
    console.error(
      'Error fetching exchange rates from Exchange Rate API:',
      error.message
    );
    return {
      success: false,
      details: 'Could not fetch data from Exchange Rate API',
    };
  }
};

const getRandomValue = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const refreshCountryData = async (req, res) => {
  try {
    // Sync the database
    await sequelize.sync();
    console.log('Database synced.');

    const countryDataResult = await fetchCountryData();
    if (!countryDataResult.success) {
      return res.status(503).json({
        error: 'External data source unavailable',
        details: countryDataResult.details,
      });
    }
    const countryData = countryDataResult.data;

    const exchangeRatesResult = await fetchExchangeRates();
    if (!exchangeRatesResult.success) {
      return res.status(503).json({
        error: 'External data source unavailable',
        details: exchangeRatesResult.details,
      });
    }
    const exchangeRates = exchangeRatesResult.rates;

    // Insert or update data in the database
    for (const country of countryData) {
      const currencyCode =
        country.currencies && country.currencies[0]
          ? country.currencies[0].code
          : null;
      const exchangeRate = currencyCode ? exchangeRates[currencyCode] : null;

      const estimatedGdp =
        country.population && exchangeRate
          ? (country.population * getRandomValue(1000, 2000)) / exchangeRate
          : null; // Set to null if currency or exchange rate is not available

      const countryPayload = {
        name: country.name,
        capital: country.capital,
        region: country.region,
        population: country.population,
        currency_code: currencyCode,
        exchange_rate: exchangeRate,
        estimated_gdp: estimatedGdp,
        flag_url: country.flag,
        last_refreshed_at: new Date(), // Update refresh timestamp
      };

      try {
        const existingCountry = await Country.findOne({
          where: { name: { [Op.like]: country.name } }, // Case-insensitive match for MySQL
        });

        if (existingCountry) {
          console.log(`Updating country: ${country.name}`);
          await existingCountry.update(countryPayload);
          console.log(`Country ${country.name} updated successfully - END`);
        } else {
          console.log(`Creating country: ${country.name}`);
          await Country.create(countryPayload);
          console.log(`Country ${country.name} created successfully - END`);
        }
      } catch (error) {
        console.error(`Error processing country ${country.name}:`, error);
      }
    }

    const totalCountries = await Country.count();
    const topGdpCountries = await Country.findAll({
      order: [['estimated_gdp', 'DESC']],
      limit: 5,
    });
    const lastRefreshRecord = await Country.findOne({
      order: [['last_refreshed_at', 'DESC']],
    });
    const lastRefreshedAt = lastRefreshRecord
      ? lastRefreshRecord.last_refreshed_at
      : null;

    await generateSummaryImage(
      totalCountries,
      topGdpCountries,
      lastRefreshedAt
    );

    const countries = await Country.findAll(); // Fetch all countries after refresh
    res.json(countries);
  } catch (error) {
    console.error('Error in refreshCountryData:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCountryData = async (req, res) => {
  try {
    const { region, currency, sort } = req.query;
    const whereClause = {};
    const orderClause = [];

    if (region) {
      whereClause.region = { [Op.like]: `%${region}%` };
    }
    if (currency) {
      whereClause.currency_code = { [Op.like]: `%${currency}%` };
    }

    if (sort === 'gdp_desc') {
      orderClause.push(['estimated_gdp', 'DESC']);
    }

    const countries = await Country.findAll({
      where: whereClause,
      order: orderClause,
    });

    res.json(countries);
  } catch (error) {
    console.error('Error in getCountryData:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCountryByName = async (req, res) => {
  try {
    console.log('Deleting country by name - START');

    const { name } = req.params;
    console.log(
      `Attempting to delete country with name: ${name} from database...`
    );
    const deletedRowCount = await Country.destroy({
      where: { name: { [Op.like]: name } }, // Case-insensitive match for MySQL
    });

    if (deletedRowCount === 0) {
      console.log(`Country with name: ${name} not found for deletion.`);
      return res.status(404).json({ error: 'Country not found' });
    }

    res.status(200).json({ message: 'Country deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCountryByName:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStatus = async (req, res) => {
  try {
    console.log('Getting status - START');

    const totalCountries = await Country.count();
    const lastRefreshRecord = await Country.findOne({
      order: [['last_refreshed_at', 'DESC']],
    });

    const lastRefreshedAt = lastRefreshRecord
      ? lastRefreshRecord.last_refreshed_at
      : null;

    console.log('Status retrieved successfully - END');
    res.json({
      total_countries: totalCountries,
      last_refreshed_at: lastRefreshedAt,
    });
  } catch (error) {
    console.error('Error in getStatus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSummaryImage = async (req, res) => {
  try {
    if (fs.existsSync(IMAGE_PATH)) {
      res.sendFile(IMAGE_PATH);
    } else {
      res.status(404).json({ error: 'Summary image not found' });
    }
  } catch (error) {
    console.error('Error serving summary image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const dummyController = async (req, res) => {
  try {
    const response = await axios.get(
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
    );

    return res.json(response.data.length);
  } catch (error) {
    console.error('Error fetching country data:', error);
    return [];
  }
};

export const getCountryByName = async (req, res) => {
  try {
    console.log('Getting country by name - START');

    const { name } = req.params;
    console.log(
      `Attempting to fetch country with name: ${name} from database...`
    );
    const country = await Country.findOne({
      where: { name: { [Op.like]: name } }, // Exact case-insensitive match for MySQL
    });

    if (!country) {
      console.log(`Country with name: ${name} not found in database.`);
      return res.status(404).json({ error: 'Country not found' });
    }

    console.log(`Country ${country.name} fetched successfully.`);
    console.log('Country data retrieved successfully - END');
    res.json(country);
  } catch (error) {
    console.error('Error in getCountryByName:', error);
    // Log the full error stack for better debugging
    console.error(error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
};
