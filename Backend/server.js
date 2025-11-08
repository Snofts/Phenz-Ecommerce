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

// === CORS: Safe + Preview-Friendly ===
const allowedDomains = [
  "phenz-ecommerce-frontend.vercel.app",
  "phenz-ecommerce-admin.vercel.app",
  "https://phenz-adminpanel.onrender.com"
];

// Local dev URLs
const allowedLocal = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow mobile apps, Postman, etc.

      const hostname = new URL(origin).hostname;

      // ✅ Allow main frontend/admin and their previews
      const isAllowed =
        allowedDomains.some(
          (domain) =>
            hostname === domain ||
            hostname.endsWith(`-${domain.split(".vercel.app")[0]}.vercel.app`)
        ) || allowedLocal.includes(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// ✅ Explicitly allow credentials for Safari/iOS
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

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
