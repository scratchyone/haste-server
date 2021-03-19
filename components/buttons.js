import styles from '../styles/HasteBox.module.css';
import hljs from 'highlight.js';

export default function buttons(
  mode /* "edit" or "view" */,
  setText,
  text,
  id,
  router
) {
  return [
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
}
