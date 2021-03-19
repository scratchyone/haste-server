import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const randOf = (collection) => {
  return () => {
    return collection[Math.floor(Math.random() * collection.length)];
  };
};

// Helper methods to get an random vowel or consonant
const randVowel = randOf('aeiou');
const randConsonant = randOf('bcdfghjklmnpqrstvwxyz');

class PhoneticKeyGenerator {
  // Generate a phonetic key of alternating consonant & vowel
  createKey(keyLength) {
    let text = '';
    const start = Math.round(Math.random());

    for (let i = 0; i < keyLength; i++) {
      text += i % 2 == start ? randConsonant() : randVowel();
    }

    return text;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ((req as any).method === 'POST') {
    const id = new PhoneticKeyGenerator().createKey(10);
    const result = await prisma.document.create({
      data: {
        id,
        text: req.body.text,
      },
    });
    res.status(200).json({ key: result.id });
  } else {
    res.status(404).send('Expected POST');
  }
}
