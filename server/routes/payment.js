import express from 'express';
import { createOrder, verifyOrder } from '../controllers/payment.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/orders', verifyToken, createOrder);
router.post('/verify', verifyToken, verifyOrder);

export default router;
