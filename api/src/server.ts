// Package imports
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Router imports
import organizations from './controllers/Organizations';

// Load env configuration
dotenv.config();

// Initalize express
const app: Application = express();

// Allow cors for development
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

// JSON body-parser middleware
app.use(express.json());

// Mount routers
const API_V0 = '/api/v0';
app.use(`${API_V0}/organizations`, organizations);

// Define server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`),
);
