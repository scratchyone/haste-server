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
        <meta name="robots" content="noindex,nofollow" />
        <title>hastebin</title>
        <noscript>
          <meta httpEquiv="refresh" content="0;url=/noscript.md" />
        </noscript>
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
