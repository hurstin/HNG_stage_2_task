import express from 'express';
import { dummyController, getCountryData } from '../controllers/controller.js';

const router = express.Router();

router.get('/dummy', dummyController);
router.get('/countries', getCountryData);

export default router;
