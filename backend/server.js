import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import { connect } from 'mongoose';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import paymentRoutes from './routes/payment.route.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(PORT, () => {  
    console.log('Server is running Http://localhost:' + PORT); 
    
    connectDB();
});  