import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS POLICY
app.use(cors());

// Routes
app.get('/', (request, response) => {
  return response.status(200).send('Welcome To Supermarket API');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Enhanced error handling
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
      console.log(`Server URL: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Failed to connect to the database. Server will not start.');
    console.error('Error details:', error);
  });
