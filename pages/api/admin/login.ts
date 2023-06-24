import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../components/db';
import { compare } from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ((req as any).method === 'POST') {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      let passwordMatch = await compare(req.body.password, user.hash);
      if (passwordMatch) {
        let session = await prisma.session.create({
          data: {
            user: {
              connect: {
                email: user.email,
              },
            },
            // Two months
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
          },
        });
        res.setHeader('Set-Cookie', [
          `session=${session.id}; Path=/; Max-Age=${60 * 60 * 24 * 60}`,
          `email=${user.email}; Path=/; Max-Age=${60 * 60 * 24 * 60}`,
          `admin=${user.admin}; Path=/; Max-Age=${60 * 60 * 24 * 60}`,
        ]);
        res.status(200).json({
          session: session.id,
          user: user.email,
          admin: user.admin,
        });
      } else {
        res.status(401).send('Invalid password');
      }
    } else {
      res.status(404).send('User not found');
    }
  } else {
    res.status(404).send('Expected POST');
  }
}
