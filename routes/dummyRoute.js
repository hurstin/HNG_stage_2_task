import express from 'express';
import {
  dummyController,
  getCountries,
  getExchangeRate,
} from '../controllers/controller.js';

const router = express.Router();

router.get('/countries', getCountries);
router.get('/dummy', dummyController);
router.get('/exchange-rate', getExchangeRate);

export default router;
