import express from 'express'
import {placeOrder, placeOrderStripe, placeOrderPaystack, verifyPaystackPayment, allOrders, userOrders, updateStatus } from '../controllers/orderController.js'
import auth from '../middleware/auth.js';

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list', auth({ admin: true }), allOrders)
orderRouter.post('/status', auth({ admin: true }), updateStatus)

// Payment features
orderRouter.post('/place', auth({ user: true }), placeOrder)
orderRouter.post('/stripe', auth({ user: true }), placeOrderStripe)
orderRouter.post('/paystack', auth({ user: true }), placeOrderPaystack)

// Paystack Webhook (must be public, no auth)
orderRouter.post('/webhook/paystack', express.raw({ type: 'application/json' }), verifyPaystackPayment);

// User Feature
orderRouter.post('/userorders', auth({ user: true }), userOrders)

export default orderRouter;