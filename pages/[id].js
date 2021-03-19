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

export async function getServerSideProps(context) {
  const realId = context.params.id.split('.')[0];
  const props = await prisma.document.findFirst({
    where: {
      id: realId,
    },
  });
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
