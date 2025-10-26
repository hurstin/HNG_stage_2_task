import express from 'express';
import { dummyController } from '../controllers/controller.js';

const router = express.Router();

router.get('/dummy', dummyController);

export default router;
