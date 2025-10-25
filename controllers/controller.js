import axios from 'axios';

export const getCountries = async (req, res) => {
  try {
    const response = await axios.get(
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
    );
    const countries = response.data;
    const currCode = countries.map((country) => {
      const curCode = country.currencies?.[0]?.code;
      return curCode;
    });
    res.json(currCode);
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
    const exchangeRateResponse = await axios.get('https://open.er-api.com/v6/latest/USD');
    const exchangeRates = exchangeRateResponse.data.rates;

    const countriesResponse = await axios.get(
      'https://restcountries.com/v2/all?fields=name,currencies,alpha2Code'
    );
    const countries = countriesResponse.data;

    const currencyRates = {};
    countries.forEach(country => {
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
