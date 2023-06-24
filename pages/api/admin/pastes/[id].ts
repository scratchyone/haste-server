import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../components/db';
import { compare } from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ((req as any).method === 'DELETE') {
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
      if (user.admin) {
        const pastes = await prisma.document.delete({
          where: {
            id: req.query.id as string,
          },
        });
        res.status(200).send('Paste deleted');
      } else {
        res.status(403).send('User must be admin to delete this content');
      }
    } else {
      res.status(401).send('User not found');
    }
  } else {
    res.status(404).send('Expected POST');
  }
}
