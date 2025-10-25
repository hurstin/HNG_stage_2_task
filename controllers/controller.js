import axios from 'axios';

export const getCountries = async (req, res) => {
  try {
    const response = await axios.get(
      'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
    );
    const countries = response.data;
    res.json(countries);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching country data');
  }
};

export const dummyController = (req, res) => {
  res.send('Hello from the dummy controller!');
};
