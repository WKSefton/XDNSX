import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import Layout from '../components/layout';
import RedirectUser from "../lib/redirectUser";


export async function getServerSideProps(context) {
    const {userId, token} = await RedirectUser(context);

    return {
        props: {
            token,
            userId
        },
    };
}

export default function MyApp({Component, pageProps}) {

    const router = useRouter();
    const [isLoginPage, setIsLoginPage] = useState(false);

    useEffect(() => {
        if (router.asPath === '/login') setIsLoginPage(true);
        else setIsLoginPage(false);
    }, [router]);

    return (isLoginPage ? <Component/> :
            <Layout>
                <Component {...pageProps} />
            </Layout>
    );
}