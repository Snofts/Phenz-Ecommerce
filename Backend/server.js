import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";

// App config
const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// === CORS: Dynamic & Secure ===
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // ✅ allow OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'],             // ✅ explicit headers
}));

// Important: raw body for Paystack webhook
app.use(
  "/api/order/webhook/paystack",
  express.raw({ type: "application/json" })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.listen(port, () => console.log("Server started on PORT : " + port));
