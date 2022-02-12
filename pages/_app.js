import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import Layout from '../components/layout/layout';
import {AppWrapper} from "../lib/utils/state";

const Noop = ({children}) => <>{children}</>;
export default function MyApp({Component, pageProps}) {

    const router = useRouter();
    const [isLoginPage, setIsLoginPage] = useState(false);

    useEffect(() => {
        //console.log(router.asPath);
        if (router.asPath == '/login') setIsLoginPage(true);
        else setIsLoginPage(false);
    }, [router]);
    const AppWrapper = Component.provider || Noop;
    return (isLoginPage ? <Component/> :
            <AppWrapper>
                <Layout>
                    <Component {...pageProps} />
                    {/*<Footer/>*/}
                </Layout>
            </AppWrapper>
    );
}