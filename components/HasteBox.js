import styles from '../styles/HasteBox.module.css';
import Link from 'next/link';
import classnames from 'classnames';
import { useState } from 'react';
import { useRouter } from 'next/router';
import getButtons from '../components/buttons';

export default function HasteBox({
  mode /* "edit" or "view" */,
  setText,
  text,
  id,
}) {
  const router = useRouter();
  const buttons = getButtons(mode, setText, text, id, router);

  const [help, setHelp] = useState(undefined);
  return (
    <div className={styles.wrapper}>
      <div className={styles.logoWrapper}>
        <Link href="/about.md">
          <div className={classnames(styles.logo, 'logo')}></div>
        </Link>
      </div>
      <div className={styles.buttonWrapper}>
        {buttons.map((button) => (
          <button
            key={button.name}
            className={classnames(
              button.class,
              styles.button,
              button.enabled || styles.disabled,
              'hastebutton'
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
