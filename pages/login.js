import Head from 'next/head';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { magic } from '../lib/magic-client';

import styles from '../styles/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  async function handleLoginWithEmail(e) {
    e.preventDefault();
    setIsLoading(true);
    if (email) {
      try {
        const didToken = await magic.auth.loginWithMagicLink({ email });
        if (didToken) router.push('/').then(setIsLoading(false));
      } catch (err) {
        console.log('Something Went Wrong Logging In', err);
      }
    } else setUserMsg('Enter Valid User Email.');
  }

  function handleOnChangeEmail(e) {
    setUserMsg('');
    setEmail(e.target.value);
  }

  return (
    <div>
      <Head>
        <title>XDNSX Sign In</title>
      </Head>

      <header>
        <h1>XDNSX</h1>
      </header>

      <main>
        <input
          type="text"
          placeholder="Email Address"
          onChange={handleOnChangeEmail}
        />
        <p>{userMsg}</p>
        <button onClick={handleLoginWithEmail}>
          {' '}
          {isLoading ? 'Loading...' : 'Sign In'}
        </button>
      </main>

      <footer></footer>
    </div>
  );
}
