import { MongoMemoryReplSet } from 'mongodb-memory-server';
import fs from 'node:fs';
import path from 'node:path';

export default async function globalTeardown() {
  const server = (globalThis as any).__TEST_SERVER__;
  const replSet = (globalThis as any).__TEST_MONGO__;

  if (server) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  if (replSet) {
    await replSet.stop();
  }

  console.log('[global-teardown] Test server and Mongo stopped');
}