/**
 * seed.ts — Seed the database with initial users.
 *
 * Run via:  npm run db:seed  (from apps/server)
 * Or:       npx prisma db seed
 *
 * Idempotent: uses upsert so re-running is safe.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log('🌱  Seeding database…');

  // ── Alice ────────────────────────────────────────────────────────────────
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
      passwordHash: await bcrypt.hash('alice-password-123', SALT_ROUNDS),
    },
  });
  console.log(`  ✓  User created/found: ${alice.name} <${alice.email}> (id: ${alice.id})`);

  // ── Bob ──────────────────────────────────────────────────────────────────
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob',
      passwordHash: await bcrypt.hash('bob-password-123', SALT_ROUNDS),
    },
  });
  console.log(`  ✓  User created/found: ${bob.name} <${bob.email}> (id: ${bob.id})`);

  console.log('✅  Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌  Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
