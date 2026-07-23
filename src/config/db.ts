import mongoose from 'mongoose';
import logger from '../logger/logger.js';

export async function connectDB(): Promise<void> {
  const DB = process.env.DATABASE_LOCAL || 'mongodb://admin:password@localhost:27017/';

  await mongoose.connect(DB, {});
  logger.info('connected to MongoDB', DB);
}