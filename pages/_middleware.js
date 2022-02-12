import {NextResponse} from 'next/server'
import {verifyToken} from '../lib/utils/verifyToken';

export async function middleware(req) {
    const token = req ? req.cookies?.token : null;
    const userId = await verifyToken(token);

    const {pathname} = req.nextUrl;
    if (pathname.includes('/api/login') || userId || pathname.includes('/static')) {
        //console.log("NEXT", pathname, userId)
        return NextResponse.next();
    }
    //console.log(token, pathname)
    if (!token && pathname !== '/login') {
        //console.log("LOGIN", pathname)
        return NextResponse.redirect('/login');
    }
}