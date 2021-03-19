import Head from 'next/head';
import styles from '../styles/Main.module.css';
import HasteBox from '../components/HasteBox';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import getButtons from '../components/buttons';

export default function Editor() {
  const router = useRouter();
  const [text, setText] = useState(router.query.text || '');
  const buttons = getButtons('edit', setText, text, null, router);
  for (const button of buttons)
    useHotkeys(
      button.shortcut,
      (e) => {
        e.preventDefault();
        button.enabled && button.onClick();
      },
      { enableOnTags: 'TEXTAREA' }
    );

  return (
    <div>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <title>hastebin</title>
        <noscript>
          <meta http-equiv="refresh" content="0;url=/noscript.md" />
        </noscript>
      </Head>
      <HasteBox mode={'edit'} text={text} setText={setText} />
      <div className={styles.codeWrapper}>
        <div className={styles.lineNumbers}>{'>'}</div>
        <textarea
          spellCheck={false}
          className={styles.codeEditor}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </div>
  );
}
