import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { openDb } from './models/db.js';
import houseRoutes from './routes/houses.js';
import imageRoutes from './routes/images.js';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Init Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/houses', houseRoutes);
app.use('/images', imageRoutes);

// Start server
app.listen(PORT, async () => {
  try {
    await openDb(); // ensure database is created
    console.log('🧱 Database initialized');
    console.log(`🚀 API running at http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Failed to initialize the database:', error);
  }
});