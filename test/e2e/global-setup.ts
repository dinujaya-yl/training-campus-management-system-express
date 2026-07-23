import { MongoMemoryReplSet } from 'mongodb-memory-server';
import type { Server } from 'node:http';

export default async function globalSetup() {
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: 'wiredTiger' },
  });

  process.env.NODE_ENV = 'test';
  process.env.DATABASE_LOCAL = replSet.getUri('test');

  const { connectDB } = await import('../../src/config/db.js');
  await connectDB();

  const { default: app } = await import('../../src/app.js');
  const port = process.env.PORT || 4000;
  const server: Server = app.listen(port);

  (globalThis as any).__TEST_SERVER__ = server;
  (globalThis as any).__TEST_MONGO__ = replSet;
}