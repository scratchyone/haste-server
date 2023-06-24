import styles from '../../styles/Main.module.css';
import adminStyles from '../../styles/Admin.module.css';
import HasteBox from '../../components/HasteBox';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

export default function UI(props) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailWidth, setEmailWidth] = useState(0);
  const [passwordWidth, setPasswordWidth] = useState(0);
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    setEmailWidth(emailRef.current.offsetWidth);
    setPasswordWidth(passwordRef.current.offsetWidth);
  }, [email, password]);

  const login = async () => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.status == 200) {
      router.push('/admin');
    } else setError('Invalid Email or Password');
  };

  return (
    <div>
      <HasteBox mode={'other'} text={props.text} id={props.id} />
      <div className={styles.codeWrapper}>
        <div className={styles.lineNumbers}>
          {new Array(error ? 9 : 7).fill().map((_, index) => (
            <span key={index + 1}>
              {index + 1}
              <br />
            </span>
          ))}
        </div>
        <div className={styles.code}>
          <pre>
            <code>
              <span style={{ color: '#e06c75' }}># Log In</span>
              <br />
              <br />
              <span>{'> '}</span>
              <span style={{ color: '#d19a66' }}>Email:{'    '}</span>
              <span
                className={adminStyles.input}
                ref={emailRef}
                style={{ visibility: 'hidden', position: 'absolute' }}
              >
                {email}
              </span>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={adminStyles.input}
                style={{ width: Math.max(emailWidth + 10, 100) }}
              />
              <br />
              <br />
              <span>{'> '}</span>
              <span style={{ color: '#d19a66' }}>Password: </span>
              <span
                className={adminStyles.input}
                ref={passwordRef}
                style={{ visibility: 'hidden', position: 'absolute' }}
              >
                {password}
              </span>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className={adminStyles.input}
                style={{ width: Math.max(passwordWidth + 10, 100) }}
              />
              <br />
              <br />
              <button className={adminStyles.button} onClick={login}>
                [Log In]
              </button>
              {error ? (
                <span>
                  <br />
                  <br />
                  <span style={{ color: '#e06c75' }}>{error}</span>
                </span>
              ) : undefined}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
