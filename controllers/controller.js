import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCountries = async (req, res) => {
  try {
    const { region, currency, sort } = req.query;

    let orderBy = {};
    if (sort === 'gdp_desc') {
      orderBy = { estimated_gdp: 'desc' };
    }

    const where = {};
    if (region) {
      where.region = region;
    }
    if (currency) {
      where.currencies = {
        contains: currency,
      };
    }

    // Check if data exists in the database
    let countries = await prisma.country.findMany({
      where,
      orderBy,
    });

    if (countries.length > 0) {
      // Data exists in the database, return it
      console.log('Data retrieved from database');
      // Parse the currencies field
      const parsedCountries = countries.map((country) => {
        return {
          ...country,
          currencies: JSON.parse(country.currencies),
        };
      });
      res.json(parsedCountries);
    } else {
      // Data does not exist in the database, fetch from API, calculate GDP, and store in the database
      console.log('Data fetched from API and stored in database');
      const response = await axios.get(
        'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
      );
      const countryData = response.data;

      // Fetch exchange rates from the Exchange Rate API
      const exchangeRateResponse = await axios.get(
        'https://open.er-api.com/v6/latest/USD'
      );
      const exchangeRates = exchangeRateResponse.data.rates;

      // Process each country to calculate estimated GDP and store in the database
      const countriesWithGDP = await Promise.all(
        countryData.map(async (country) => {
          // Get the currency code of the country
          const currencyCode = country.currencies?.[0]?.code;
          // Get the exchange rate for the currency, default to 1 if not found
          const exchangeRate = exchangeRates[currencyCode] || 1;
          // Generate a random number between 1000 and 2000
          const randomNumber =
            Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
          // Calculate the estimated GDP
          const estimated_gdp =
            (country.population * randomNumber) / exchangeRate;

          // Store the country data with estimated GDP in the database
          await prisma.country.upsert({
            where: { name: country.name },
            update: {
              capital: country.capital,
              region: country.region,
              population: country.population,
              flag: country.flag,
              currencies: JSON.stringify(country.currencies),
              estimated_gdp: estimated_gdp,
            },
            create: {
              name: country.name,
              capital: country.capital,
              region: country.region,
              population: country.population,
              flag: country.flag,
              currencies: JSON.stringify(country.currencies),
              estimated_gdp: estimated_gdp,
            },
          });

          // Return the country object with the estimated GDP
          return {
            ...country,
            estimated_gdp,
          };
        })
      );

      countries = await prisma.country.findMany({
        where,
        orderBy,
      });

      const parsedCountries = countries.map((country) => {
        return {
          ...country,
          currencies: JSON.parse(country.currencies),
        };
      });

      // Send the processed country data with estimated GDP as a JSON response
      res.json(parsedCountries);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching country data');
  } finally {
    await prisma.$disconnect();
  }
};

export const refreshCountries = async (req, res) => {
  try {
    // Fetch country data from the REST Countries API
    const response = await axios.get(
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
    );
    const countryData = response.data;

    // Fetch exchange rates from the Exchange Rate API
    const exchangeRateResponse = await axios.get(
      'https://open.er-api.com/v6/latest/USD'
    );
    const exchangeRates = exchangeRateResponse.data.rates;

    // Process each country to calculate estimated GDP and store in the database
    const countriesWithGDP = await Promise.all(
      countryData.map(async (country) => {
        // Get the currency code of the country
        const currencyCode = country.currencies?.[0]?.code;
        // Get the exchange rate for the currency, default to 1 if not found
        const exchangeRate = exchangeRates[currencyCode] || 1;
        // Generate a random number between 1000 and 2000
        const randomNumber =
          Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
        // Calculate the estimated GDP
        const estimated_gdp =
          (country.population * randomNumber) / exchangeRate;

        // Store the country data with estimated GDP in the database
        await prisma.country.upsert({
          where: { name: country.name },
          update: {
            capital: country.capital,
            region: country.region,
            population: country.population,
            flag: country.flag,
            currencies: JSON.stringify(country.currencies),
            estimated_gdp: estimated_gdp,
          },
          create: {
            name: country.name,
            capital: country.capital,
            region: country.region,
            population: country.population,
            flag: country.flag,
            currencies: JSON.stringify(country.currencies),
            estimated_gdp: estimated_gdp,
          },
        });

        // Return the country object with the estimated GDP
        return {
          ...country,
          estimated_gdp,
        };
      })
    );

    console.log('Data fetched from API and stored in database');
    res.json({ message: 'Countries data refreshed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while refreshing country data');
  }
};

export const dummyController = (req, res) => {
  res.send('Hello from the dummy controller!');
};

export const getExchangeRate = async (req, res) => {
  try {
    const exchangeRateResponse = await axios.get(
      'https://open.er-api.com/v6/latest/USD'
    );
    const exchangeRates = exchangeRateResponse.data.rates;

    const countriesResponse = await axios.get(
      'https://restcountries.com/v2/all?fields=name,currencies,alpha2Code'
    );
    const countries = countriesResponse.data;

    const currencyRates = {};
    countries.forEach((country) => {
      if (country.currencies && country.currencies.length > 0) {
        const currencyCode = country.currencies[0].code;
        if (exchangeRates[currencyCode]) {
          currencyRates[currencyCode] = exchangeRates[currencyCode];
        }
      }
    });

    res.json(currencyRates);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching exchange rate');
  }
};
