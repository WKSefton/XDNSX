import {NextResponse} from 'next/server'
import {verifyToken} from '../lib/verifyToken';

export async function middleware(request) {
    const token = request ? request.cookies?.token : null;
    const userId = await verifyToken(token);
    const {pathname} = request.nextUrl;

    console.log({token}, {userId}, {pathname})

    if (pathname.includes('/api/login') || userId)
        return NextResponse.next();

    if (!token && pathname !== '/login')
        return NextResponse.redirect('/login');

}