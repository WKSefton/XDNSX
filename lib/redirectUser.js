import {verifyToken} from "./verifyToken";

async function RedirectUser(context) {
    const token = context.req ? context.req.cookies?.token : null;

    const userId = await verifyToken(token);

    return {
        userId,
        token
    };
}

export default RedirectUser;