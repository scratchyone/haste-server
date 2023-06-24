import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../components/db';
import { Document } from '@prisma/client';

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

export interface DocumentCreationDetails {
  text: string;
}

export async function createPaste(
  data: DocumentCreationDetails
): Promise<Document> {
  const id = new PhoneticKeyGenerator().createKey(10);
  const result = await prisma.document.create({
    data: {
      id,
      text: data.text,
    },
  });
  return result;
}
