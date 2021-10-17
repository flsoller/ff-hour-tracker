// Package imports
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

// Define server port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`),
);
