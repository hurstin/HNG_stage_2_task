import axios from 'axios';
import Country from '../models/Country.js';
import sequelize from '../db.js';
import { Op } from 'sequelize';

const fetchCountryData = async () => {
  try {
    const response = await axios.get(
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching country data:', error);
    return [];
  }
};

const fetchExchangeRates = async () => {
  try {
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return {};
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

    const countryData = await fetchCountryData();
    const exchangeRates = await fetchExchangeRates();

    console.log(countryData.length + ' countries fetched from external API.');

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

    const countries = await Country.findAll(); // Fetch all countries after refresh
    res.json(countries);
  } catch (error) {
    console.error('Error in refreshCountryData:', error);
    res.status(500).send('Server error');
  }
};

export const getCountryData = async (req, res) => {
  try {
    await sequelize.sync();
    console.log('Database synced.');

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
    res.status(500).send('Server error');
  }
};

export const deleteCountryByName = async (req, res) => {
  try {
    console.log('Deleting country by name - START');
    await sequelize.sync();
    console.log('Database synced.');

    const { name } = req.params;
    console.log(
      `Attempting to delete country with name: ${name} from database...`
    );
    const deletedRowCount = await Country.destroy({
      where: { name: { [Op.like]: name } }, // Case-insensitive match for MySQL
    });

    if (deletedRowCount === 0) {
      console.log(`Country with name: ${name} not found for deletion.`);
      return res.status(404).send('Country not found');
    }

    console.log(`Country ${name} deleted successfully.`);
    console.log('Country deletion successful - END');
    res.status(200).send('Country deleted successfully');
  } catch (error) {
    console.error('Error in deleteCountryByName:', error);
    res.status(500).send('Server error');
  }
};

export const getStatus = async (req, res) => {
  try {
    console.log('Getting status - START');
    await sequelize.sync();
    console.log('Database synced.');

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
    res.status(500).send('Server error');
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
    await sequelize.sync();
    console.log('Database synced.');

    const { name } = req.params;
    console.log(
      `Attempting to fetch country with name: ${name} from database...`
    );
    const country = await Country.findOne({
      where: { name: { [Op.like]: name } }, // Exact case-insensitive match for MySQL
    });

    if (!country) {
      console.log(`Country with name: ${name} not found in database.`);
      return res.status(404).send('Country not found');
    }

    console.log(`Country ${country.name} fetched successfully.`);
    console.log('Country data retrieved successfully - END');
    res.json(country);
  } catch (error) {
    console.error('Error in getCountryByName:', error);
    // Log the full error stack for better debugging
    console.error(error.stack);
    res.status(500).send('Server error');
  }
};
