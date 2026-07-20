import app from './app.js';
import mongoose from 'mongoose';
import "./utils/redis.client.js";
import "./utils/scheduler.js";
import config from './env.js';
import logger from './logger/logger.js';
// import dotenv from 'dotenv';

// dotenv.config({path: './config.env'});

logger.info('Application starting. Log level', config.LOG_LEVEL)


const DB = process.env.DATABASE_LOCAL || 'mongodb://admin:password@localhost:27017/';

mongoose.connect(DB,{});
logger.info('connected to MongoDB', DB);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server running here on http://localhost:${port}`);
});