import Head from 'next/head';
import styles from '../styles/Main.module.css';
import HasteBox from '../components/HasteBox';
import { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { useRouter } from 'next/router';
import hljs from 'highlight.js';

export default function Viewer(props) {
  const router = useRouter();
  // If session cookie exists
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    setAdmin(
      document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith('session='))
    );
  }, []);
  if (router.query.id == 'noscript.md' && typeof window != 'undefined')
    router.push('/');

  return (
    <div>
      <Head>
        <meta property="og:title" content="a paste on hastebin" />
        <meta property="og:site_name" content="hastebin" />
        <meta
          property="og:description"
          content={
            props.text.length > 100
              ? props.text.slice(0, 100) + '...'
              : props.text
          }
        />
      </Head>
      <HasteBox mode={'view'} admin={admin} text={props.text} id={props.id} />
      <div className={styles.codeWrapper}>
        <div className={styles.lineNumbers}>
          {props.text.split('\n').map((_, index) => (
            <span key={index + 1}>
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
            <pre>
              <code dangerouslySetInnerHTML={{ __html: props.highlighted }} />
            </pre>
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
  if (filenames.includes(context.params.id)) {
    const text = await fs.readFile(
      path.join(presetsDirectory, context.params.id),
      'utf8'
    );
    return {
      props: {
        text,
        id: realId,
        highlighted: hljs.highlightAuto(
          text,
          context.params.id.split('.')[1]
            ? [context.params.id.split('.')[1]]
            : undefined
        ).value,
        ...(context.params.id.split('.')[1]
          ? { extension: context.params.id.split('.')[1] }
          : {}),
      },
    };
  }
  const props = await prisma.document.findFirst({
    where: {
      id: realId,
    },
    select: {
      text: true,
      id: true,
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
      highlighted: hljs.highlightAuto(
        props.text,
        context.params.id.split('.')[1]
          ? [context.params.id.split('.')[1]]
          : undefined
      ).value,
      id: realId,
      ...(context.params.id.split('.')[1]
        ? { extension: context.params.id.split('.')[1] }
        : {}),
    },
  };
}
