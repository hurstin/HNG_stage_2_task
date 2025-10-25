import axios from 'axios';

export const getCountries = async (req, res) => {
  try {
    const response = await axios.get(
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
    );
    const countries = response.data;
    const currCode = countries.map((country) => country?.currencies);
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
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    const exchangeRate = response.data;
    res.json(exchangeRate);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching exchange rate');
  }
};
