import express from 'express';
import { dummyController, getCountries } from '../controllers/controller.js';

const router = express.Router();

router.get('/countries', getCountries);
router.get('/dummy', dummyController);

export default router;
