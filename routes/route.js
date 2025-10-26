import express from 'express';
import {
  dummyController,
  getCountryData,
  refreshCountryData,
  getCountryByName,
  deleteCountryByName,
  getStatus,
  getSummaryImage,
} from '../controllers/controller.js';

const router = express.Router();

router.get('/dummy', dummyController);
router.get('/countries', getCountryData);
router.post('/countries/refresh', refreshCountryData);
router.get('/countries/image', getSummaryImage);
router.get('/countries/:name', getCountryByName);
router.delete('/countries/:name', deleteCountryByName);
router.get('/status', getStatus);

export default router;
