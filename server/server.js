// This file is in es6 form
import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';

import cors from 'cors'

dotenv.config();

// database config
connectDB();

// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// rest api
const PORT = process.env.PORT || 8080;

//routes
app.use('/api/v1/auth', authRoutes);

// Define a route
app.get('/', (req, res) => {
  // res.send(htmlContent);
  res.send('<h1>Hello, eCommerce website is live!!</h1>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is on ${process.env.DEV_MODE} running on http://localhost:${PORT}`.bgBlue.black);
});
