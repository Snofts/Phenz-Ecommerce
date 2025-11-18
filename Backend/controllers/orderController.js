import orderModal from "../models/orderModal.js";
import userModel from "./../models/userModel.js";
import crypto from 'crypto';
import Paystack from 'paystack-api';


const paystackClient = Paystack(process.env.PAYSTACK_SECRET_KEY);

const deliveryCharges = 10; // Set a fixed delivery charge, can be dynamic based on location

// Placing order using COD method
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ← FROM auth() MIDDLEWARE
    const { items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModal(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing order using Stripe method
const placeOrderStripe = async () => {};

// 1. INITIATE PAYSTACK (DO NOT CREATE FINAL ORDER)
const placeOrderPaystack = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    // Create PENDING order
    const pendingOrder = new orderModal({
      userId,
      items,
      amount,
      address,
      paymentMethod: "Paystack",
      payment: false,
      status: "pending",
      paystackRef: `phenz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: Date.now(),
    });

    await pendingOrder.save();

    // Initialize Paystack
    const transaction = await paystackClient.transaction.initialize({
      email: address.email,
      amount: amount * 100,
      reference: pendingOrder.paystackRef,
      callback_url: `${req.headers.origin}/orders`, // redirect after payment
      metadata: {
        order_id: pendingOrder._id.toString(),
        user_id: userId,
      },
    });

    res.json({
      success: true,
      authorization_url: transaction.data.authorization_url,
      reference: pendingOrder.paystackRef,
    });

  } catch (error) {
    console.error("Paystack Init Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// 2. WEBHOOK — THIS IS YOUR SECURITY GATE
const verifyPaystackPayment = async (req, res) => {
  try {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).send('Invalid signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const ref = event.data.reference;
      const order = await orderModal.findOne({ paystackRef: ref });

      if (order && !order.payment) {
        order.payment = true;
        order.status = "paid";
        await order.save();

        // CLEAR USER CART
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook Error:", error);
    res.sendStatus(500);
  }
};

// CANCEL ORDER WHEN USER ABORTS PAYMENT
const cancelOrderPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    const order = await orderModal.findOne({ paystackRef: reference });

    if (order && !order.payment) {
      order.payment = false
      order.status = "Cancelled";
      await order.save();
    }

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};





// All orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModal.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
  }
};

// User Order data for frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id; // ← FROM auth() MIDDLEWARE
    const orders = await orderModal.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModal.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderPaystack,
  verifyPaystackPayment,
  allOrders,
  userOrders,
  updateStatus,
  cancelOrderPayment
};
