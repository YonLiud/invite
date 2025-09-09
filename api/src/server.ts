import "reflect-metadata";
import express from 'express';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import logger from './utils/logger';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}))

AppDataSource.initialize()
  .then(async () => {
    logger.info("Data Source has been initialized!");

    // Routes
    app.use('/auth', authRoutes);
    app.use('/profiles', profileRoutes);

    app.get('/', (req, res) => {
      res.send('Hello from your learning backend! 🚀');
    });

    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization:", err);
  });