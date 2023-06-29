import Head from 'next/head';
import styles from '../styles/Main.module.css';
import HasteBox from '../components/HasteBox';
import { useState } from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';

export default function Editor() {
  const router = useRouter();
  const [text, setText] = useState(router.query.text || '');

  return (
    <div>
      <Head>
        <meta property="og:title" content="create a paste on hastebinz" />
        <meta property="og:site_name" content="hastebin" />
        <meta
          property="og:description"
          content="hastebin is the prettiest, easiest to use pastebin ever made"
        />
      </Head>
      <HasteBox mode={'edit'} text={text} setText={setText} />
      <div className={styles.codeWrapper}>
        <div className={styles.lineNumbers}>{'>'}</div>
        <textarea
          spellCheck={false}
          className={classnames(styles.codeEditor, 'mousetrap')}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
}
