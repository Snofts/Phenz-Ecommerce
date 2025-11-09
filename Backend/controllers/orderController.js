import orderModal from "../models/orderModal.js";
import userModel from "./../models/userModel.js";
import crypto from 'crypto';
import Paystack from 'paystack-api';


const paystackClient = Paystack(process.env.PAYSTACK_SECRET_KEY);

const deliveryCharges = 10; // Set a fixed delivery charge, can be dynamic based on location

// Placing order using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

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

// Placing order using Paystack method
const placeOrderPaystack = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    if (!origin) {
      return res.json({ success: false, message: "Origin header is required" });
    }


    const orderData = {
      userId,
      items,
      amount,
      address,
      deliveryCharges,
      paymentMethod: "Paystack",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModal(orderData);
    await newOrder.save();


    // Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // === INITIALIZE PAYSTACK ===
    const transaction = await paystackClient.transaction.initialize({
      email: address.email,
      amount: amount * 100, // in kobo
      currency: "NGN",
      reference: newOrder._id.toString(),
      callback_url: `${origin}/verify-paystack`,
      metadata: {
        order_id: newOrder._id.toString(),
        user_id: userId,
        delivery_fee: deliveryCharges,
      },
    });

    res.json({
      success: true,
      authorization_url: transaction.data.authorization_url,
      orderId: newOrder._id,
      totalAmount: amount
    });

    
  } catch (error) {
    console.error("Paystack Init Error:", error);
    res.json({ success: false, message: error.message });
  }
};




// Verify Paystack Payment via Webhook
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
      const reference = event.data.reference;
      const order = await orderModal.findById(reference);

      if (order && !order.payment) {
        order.payment = true;
        order.status = 'Paid';
        await order.save();

        // Optional: send email, trigger fulfillment, etc.
      }
    }

    res.sendStatus(200); // Acknowledge receipt
  } catch (error) {
    console.error("Webhook Error:", error);
    res.sendStatus(500);
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
    const { userId } = req.body;
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
};
