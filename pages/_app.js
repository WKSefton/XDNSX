import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import Layout from '../components/layout';

import NextNProgress from "nextjs-progressbar";


export default function MyApp({Component, pageProps}) {

    const router = useRouter();
    const [isLoginPage, setIsLoginPage] = useState(true);

    useEffect(() => {
        if (router.asPath == '/login') setIsLoginPage(true);
        else setIsLoginPage(false);
    }, [router]);

    return (
        <>
            <NextNProgress height={5} options={{parent: "#layout"}}/>
            {isLoginPage ? <Component {...pageProps}/> :
                <Layout {...pageProps}>
                    <Component {...pageProps} />
                </Layout>}
        </>
    );
}