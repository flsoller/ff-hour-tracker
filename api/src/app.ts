// Package imports
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Middleware imports
import errorHandler from './middleware/errorHandler';

// Controller imports
import organizations from './controllers/Organizations';
import members from './controllers/Members';
import activities from './controllers/Activities';
import timelog from './controllers/TimeLogs';

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

// Mount routes
const API_V0 = '/api/v0';
app.use(`${API_V0}/organizations`, organizations);
app.use(`${API_V0}/members`, members);
app.use(`${API_V0}/activities`, activities);
app.use(`${API_V0}/timelog`, timelog);

// Error handling middleware
app.use(errorHandler);

export default app;
