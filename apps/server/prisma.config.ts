// dotenv must be imported first so DATABASE_URL is available before Prisma reads it.
// When prisma.config.ts is present, Prisma skips its own .env auto-loading.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
});
