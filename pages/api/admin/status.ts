import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../components/db';
import { compare } from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ((req as any).method === 'POST') {
    const session = await prisma.session.findUnique({
      where: {
        id: req.cookies.session,
      },
      include: {
        user: true,
      },
    });
    const user = session.user;
    if (user) {
      res.status(200).json({
        user: user.email,
        admin: user.admin,
      });
    } else {
      res.status(401).send('User not found');
    }
  } else {
    res.status(404).send('Expected POST');
  }
}
