import styles from '../../styles/Main.module.css';
import adminStyles from '../../styles/Admin.module.css';
import HasteBox from '../../components/HasteBox';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

export default function UI(props) {
  const router = useRouter();
  const [pastes, setPastes] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await fetch('/api/admin/pastes').then((res) => res.json());
      setPastes(data.pastes);
    })();
  }, []);
  return (
    <div>
      <HasteBox mode={'other'} text={props.text} id={props.id} />
      <div className={styles.codeWrapper}>
        <div className={styles.lineNumbers}>
          {new Array(4 + pastes.length).fill().map((_, index) => (
            <span key={index + 1}>
              {index + 1}
              <br />
            </span>
          ))}
        </div>
        <div className={styles.code}>
          <pre>
            <code>
              <span style={{ color: '#e06c75' }}># Admin Panel</span>
              <br />
              <br />
              <span style={{ color: '#d19a66' }}>## Pastes:</span>
              <br />
              <br />
              {pastes.map((paste) => (
                <>
                  *{' '}
                  <a
                    style={{ color: '#61afef' }}
                    key={paste.id}
                    href={'/' + paste.id}
                  >
                    {paste.id}
                  </a>
                  :{' '}
                  <span
                    style={{
                      color: '#5c6370',
                    }}
                  >
                    {paste.characters} characters, {paste.timestamp}
                  </span>
                  <br />
                </>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
