import express from 'express'
import {placeOrder, placeOrderStripe, placeOrderPaystack, verifyPaystackPayment, allOrders, userOrders, updateStatus } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/paystack', authUser, placeOrderPaystack)

// Paystack Webhook (must be public, no auth)
orderRouter.post('/webhook/paystack', express.raw({ type: 'application/json' }), verifyPaystackPayment);

// User Feature
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter;