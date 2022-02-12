import cookie from 'cookie';

const MAX_AGE = 7 * 24 * 60 * 60;

export async function setTokenCookie(token, res) {
    const tokenCookie = cookie.serialize('token', token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        secure: process.env.NODE_ENV === 'production',
        path: "/"
    });

    res.setHeader('Set-Cookie', tokenCookie)
}

export async function getTokenCookie() {
    const name = "token"
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

export const removeTokenCookie = (res) => {
    const val = cookie.serialize("token", "", {
        maxAge: -1,
        path: "/",
    });

    res.setHeader("Set-Cookie", val);
};
