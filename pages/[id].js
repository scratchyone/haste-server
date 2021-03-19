import Head from 'next/head';
import styles from '../styles/Main.module.css';
import HasteBox from '../components/HasteBox';
import { useState } from 'react';
import { PrismaClient } from '@prisma/client';
import Highlight from 'react-highlight';
const prisma = new PrismaClient();

export default function Viewer(props) {
  return (
    <div>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <title>hastebin</title>
      </Head>
      <HasteBox mode={'view'} text={props.text} id={props.id} />
      <div className={styles.codeWrapper}>
        <div className={styles.lineNumbers}>
          {props.text.split('\n').map((_, index) => (
            <span>
              {index + 1}
              <br />
            </span>
          ))}
        </div>
        <div className={styles.code}>
          {props.extension == 'txt' ? (
            <pre>
              <code>{props.text}</code>
            </pre>
          ) : (
            <Highlight className={props.extension}>{props.text}</Highlight>
          )}
        </div>
      </div>
    </div>
  );
}
import path from 'path';
import { promises as fs } from 'fs';

export async function getServerSideProps(context) {
  const presetsDirectory = path.join(process.cwd(), 'presets');
  const filenames = await fs.readdir(presetsDirectory);

  const realId = context.params.id.split('.')[0];
  if (filenames.includes(context.params.id))
    return {
      props: {
        text: await fs.readFile(
          path.join(presetsDirectory, context.params.id),
          'utf8'
        ),
        id: realId,
        ...(context.params.id.split('.')[1]
          ? { extension: context.params.id.split('.')[1] }
          : {}),
      },
    };
  const props = await prisma.document.findFirst({
    where: {
      id: realId,
    },
  });
  if (props === null)
    return {
      redirect: {
        permanent: false,
        destination: '/404.md',
      },
    };

  return {
    props: {
      ...props,
      id: realId,
      ...(context.params.id.split('.')[1]
        ? { extension: context.params.id.split('.')[1] }
        : {}),
    },
  };
}
