import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../components/db';

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

export default function _() {
  return null;
}

export async function getServerSideProps(ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const { req, res } = ctx;
  if ((req as any).method === 'POST') {
    let bodyPromise = new Promise((resolve, reject) => {
      let body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        resolve(body);
      });
    });
    let body = await bodyPromise;
    console.log(body);
    const id = new PhoneticKeyGenerator().createKey(10);
    const result = await prisma.document.create({
      data: {
        id,
        text: body,
      },
    });
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write(JSON.stringify({ key: result.id }));
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
  return { props: {} };
}
