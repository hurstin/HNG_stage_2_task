import express from 'express';
import {
  dummyController,
  getCountryData,
  refreshCountryData,
  getCountryByName,
} from '../controllers/controller.js';

const router = express.Router();

router.get('/dummy', dummyController);
router.get('/countries', getCountryData);
router.post('/countries/refresh', refreshCountryData);
router.get('/countries/:name', getCountryByName);

export default router;
