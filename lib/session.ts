import { prisma } from '../components/db';
import { User } from '@prisma/client';

export async function verifySession(token: string): Promise<User> {
  let session = await prisma.session.findUnique({
    where: {
      id: token,
    },
    include: {
      user: true,
    },
  });
  if (!session) {
    throw new Error('Invalid session');
  }
  if (session.expires < new Date()) {
    throw new Error('Session expired');
  }
  return session.user;
}
