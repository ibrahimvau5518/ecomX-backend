import express, { Application } from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import { notFound, errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;