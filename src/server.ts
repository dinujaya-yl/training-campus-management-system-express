import app from './app.js';
import { connectDB } from './config/db.js';
import "./utils/redis.client.js";
import "./utils/scheduler.js";
import config from './env.js';
import logger from './logger/logger.js';

logger.info('Application starting. Log level', config.LOG_LEVEL);

async function start() {
  await connectDB();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server running here on http://localhost:${port}`);
  });
}

start();