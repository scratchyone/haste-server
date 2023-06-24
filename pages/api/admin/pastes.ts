import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../components/db';
import { compare } from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ((req as any).method === 'GET') {
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
        const pastes = await prisma.document.findMany({
          orderBy: {
            timestamp: 'asc',
          },
          select: {
            id: true,
            timestamp: true,
            text: true,
          },
        });
        res.status(200).json({
          pastes: pastes.map((paste) => {
            return {
              id: paste.id,
              timestamp: formatUnixTimestamp(paste.timestamp),
              characters: paste.text.length,
            };
          }),
        });
      } else {
        res.status(403).send('User must be admin to access this content');
      }
    } else {
      res.status(401).send('User not found');
    }
  } else {
    res.status(404).send('Expected POST');
  }
}

function formatUnixTimestamp(timestamp) {
  const now = Date.now();
  const difference = now - timestamp;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  const parts = [];
  if (days > 0) {
    parts.push(days === 1 ? '1d' : `${days}d`);
  }
  if (hours > 0) {
    parts.push(hours === 1 ? '1h' : `${hours}h`);
  }
  if (minutes > 0) {
    parts.push(minutes === 1 ? '1m' : `${minutes}m`);
  }

  if (parts.length === 0) {
    return 'Just now';
  } else {
    const lastPart = parts.pop();
    if (parts.length === 0) {
      return lastPart + ' ago';
    } else {
      return parts.join(', ') + ', and ' + lastPart + ' ago';
    }
  }
}
