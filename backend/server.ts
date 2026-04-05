import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import authRoutes from './routes/authRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import bookingRoutes from './routes/bookingRoutes';
import { seedRestaurants } from './seed/seedData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && (mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://'))) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      });
      console.log('Connected to MongoDB');
      await seedRestaurants();
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  } else {
    console.error('CRITICAL: MONGODB_URI is missing or invalid. Please set a valid MongoDB connection string in the Secrets panel.');
    console.warn('Database features will not work until a valid MONGODB_URI is provided.');
  }

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/restaurants', restaurantRoutes);
  app.use('/api/bookings', bookingRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
