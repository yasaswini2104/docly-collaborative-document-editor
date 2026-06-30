import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { authenticate } from '../../middleware/authenticate.js';

export const usersRouter = Router();

usersRouter.use(authenticate);

/**
 * GET /api/users
 * Returns a list of users for the share dropdown.
 * In a real app this would be paginated/searched, but for this exercise we return all.
 */
usersRouter.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: 'asc' },
  });
  res.json(users);
});
