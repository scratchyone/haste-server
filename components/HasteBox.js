import styles from '../styles/HasteBox.module.css';
import Link from 'next/link';
import classnames from 'classnames';
import { useState } from 'react';
import { useRouter } from 'next/router';
import hljs from 'highlight.js';

export default function HasteBox({
  mode /* "edit" or "view" */,
  setText,
  text,
  id,
}) {
  const router = useRouter();
  const buttons = [
    {
      name: 'Save',
      class: styles.saveButton,
      shortcut: 'control + s',
      enabled: mode == 'edit',
      onClick: async () => {
        router.push(
          '/' +
            (
              await (
                await fetch('/api/documents', {
                  method: 'POST',
                  body: JSON.stringify({ text }),
                  headers: { 'Content-Type': 'application/json' },
                })
              ).json()
            ).key +
            '.' +
            (hljs.highlightAuto(text).language || 'txt')
        );
      },
    },
    {
      name: 'New',
      class: styles.newButton,
      shortcut: 'control + n',
      enabled: true,
      onClick: () => {
        if (mode == 'edit') setText('');
        else router.push('/');
      },
    },
    {
      name: 'Duplicate & Edit',
      class: styles.editButton,
      shortcut: 'control + d',
      enabled: mode == 'view',
      onClick: () => {
        router.push(`/?text=${encodeURIComponent(text)}`, '/');
      },
    },
    {
      name: 'Just Text',
      class: styles.rawButton,
      shortcut: 'control + shift + r',
      enabled: mode == 'view',
      onClick: () => {
        router.push('/raw/' + id);
      },
    },
    {
      name: 'Twitter',
      class: styles.tweetButton,
      shortcut: 'control + shift + t',
      enabled: mode == 'view',
      onClick: () => {
        window.open(
          'https://twitter.com/share?url=' + encodeURI(window.location.href)
        );
      },
    },
  ];
  const [help, setHelp] = useState(undefined);
  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <Link href="/about.md">
          <div className={styles.logo}></div>
        </Link>
      </div>
      <div className={styles.buttonWrapper}>
        {buttons.map((button) => (
          <button
            className={classnames(
              button.class,
              styles.button,
              button.enabled || styles.disabled
            )}
            onMouseOver={() => setHelp(button)}
            onMouseOut={() => setHelp(undefined)}
            onClick={() => button.enabled && button.onClick()}
          />
        ))}
      </div>
      {help && (
        <div className={styles.buttonHelpWrapper}>
          <div className={styles.buttonHelpName}>{help.name}</div>
          <div className={styles.buttonHelpShortcut}>{help.shortcut}</div>
        </div>
      )}
    </div>
  );
}
