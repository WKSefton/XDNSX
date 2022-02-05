import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { magic } from '../lib/magic-client';

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState('');

  useEffect(() => {
    async function getUserMetaData() {
      const { email } = await magic.user.getMetadata();
      if (email) setUsername(email);
    }
    getUserMetaData();
  }, []);

  async function signOut(e) {
    e.preventDefault();

    try{
      router.push('/login');
      await magic.user.logout();
      console.log(await magic.user.isLoggedIn());
    }catch(err){
      console.log("Error Signing Out", err)
    }
  }

  return (
    <div>
      <Head>
        <title>XDNSX</title>
        <meta name="description" content="XDNSX Financal Planning Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <p>{username}</p>
        <button onClick={signOut}>Sign Out</button>
      </header>

      <main>MAIN</main>

      <footer>FOOTER</footer>
    </div>
  );
}
