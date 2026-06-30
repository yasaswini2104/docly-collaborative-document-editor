import { prisma } from './src/lib/prisma.js';

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users);
}

main().catch(console.error).finally(() => prisma.$disconnect());
