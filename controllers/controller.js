import axios from 'axios';

export const getCountries = async (req, res) => {
  try {
    // Fetch country data from the REST Countries API
    const response = await axios.get(
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
    );
    const countries = response.data;

    // Fetch exchange rates from the Exchange Rate API
    const exchangeRateResponse = await axios.get(
      'https://open.er-api.com/v6/latest/USD'
    );
    const exchangeRates = exchangeRateResponse.data.rates;

    // Process each country to calculate estimated GDP
    const countriesWithGDP = countries.map((country) => {
      // Get the currency code of the country
      const currencyCode = country.currencies?.[0]?.code;
      // Get the exchange rate for the currency, default to 1 if not found
      const exchangeRate = exchangeRates[currencyCode] || 1;
      // Generate a random number between 1000 and 2000
      const randomNumber = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
      // Calculate the estimated GDP
      const estimated_gdp = (country.population * randomNumber) / exchangeRate;
      // Return the country object with the estimated GDP
      return {
        ...country,
        estimated_gdp,
      };
    });

    // Send the processed country data with estimated GDP as a JSON response
    res.json(countriesWithGDP);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching country data');
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
