import 'dotenv/config.js';
import cluster from 'cluster';
import os from 'os';
import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';
import logger from './src/config/logger.js';

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const numCPUs = os.cpus().length;

// Clustering pour production (améliore les performances)
if (NODE_ENV === 'production' && cluster.isPrimary) {
  logger.info(`Master process ${process.pid} is running`);

  // Fork workers égal au nombre de CPUs
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Redémarrer les workers qui crashent
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    cluster.fork();
  });
} else {
  // Code du worker (ou du processus principal en développement)
  const startServer = async () => {
    try {
      // Connexion à la base de données
      await connectDatabase();
      logger.info('Database connected successfully');

      // Démarrage du serveur
      app.listen(PORT, () => {
        logger.info(`Server running on http://localhost:${PORT} (${NODE_ENV})`);
        if (NODE_ENV === 'production') {
          logger.info(`Worker process ${process.pid} started`);
        }
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();

  // Gestion graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}
