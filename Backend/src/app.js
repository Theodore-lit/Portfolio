import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from './config/logger.js';

const app = express();

// ===========================
// Trust Proxy (pour les déploiements avec reverse proxy)
// ===========================
app.set('trust proxy', 1);

// ===========================
// Middlewares de Sécurité
// ===========================
app.use(helmet()); // Headers de sécurité
app.use(compression()); // Compression Gzip

// ===========================
// CORS Configuration
// ===========================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
  })
);

// ===========================
// Logging (Optionnel - Morgan)
// ===========================
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg) } }));

// ===========================
// Body Parser Middlewares
// ===========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ===========================
// Static Files
// ===========================
app.use('/uploads', express.static('uploads'));

// ===========================
// Health Check Route
// ===========================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ===========================
// API Routes
// ===========================
app.use('/api', routes);

// ===========================
// 404 Handler
// ===========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// ===========================
// Error Handler (DOIT être le dernier middleware)
// ===========================
app.use(errorHandler);

export default app;
