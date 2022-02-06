import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { magic } from '../lib/magic-client';

import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import Loading from '../components/loading/loading';
import Layout from '../components/layout/layout';
import Login from './login';
function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoading(false);
    // async function checkLoggedIn() {
    //   setIsLoggedIn(await magic.user.isLoggedIn());
    //   if (!isLoggedIn) router.push('/login');
    // }

    // checkLoggedIn();
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      if (isLoading) setIsLoading(false);
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return isLoading ? (
    <Loading />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
