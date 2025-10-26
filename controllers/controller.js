import axios from 'axios';

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

export const getCountryData = async (req, res) => {
  try {
    const countryData = await fetchCountryData();
    res.json(countryData);
  } catch (error) {
    console.error('Error in getCountryData:', error);
    res.status(500).send('Server error');
  }
};

export const dummyController = (req, res) => {
  res.send('Hello from the dummy controller!');
};
