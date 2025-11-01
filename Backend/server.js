import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoutes.js'
import cookieParser from 'cookie-parser';

// App config
const app = express()
app.use(cookieParser());
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Important: raw body for Paystack webhook
app.use('/api/order/webhook/paystack', express.raw({ type: 'application/json' }));

// Middleware
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === process.env.FRONTEND_URL || origin === process.env.ADMIN_URL || origin === 'https://phenz-ecommerce-frontend.vercel.app/' || origin === 'https://phenz-ecommerce-admin.vercel.app/') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true                 // Allow cookies
}))


// Api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) => {
    res.send('Api is working')
})


app.listen(port, () => console.log('Server started on PORT : '+ port))