import express from 'express';
import { getAllPrices, getPrice, updatePrices } from '../controllers/marketController';

const router = express.Router();

router.get('/prices', getAllPrices);
router.get('/prices/:symbol', getPrice);
router.post('/prices', updatePrices);

export default router;
