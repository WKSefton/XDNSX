import { magicAdmin } from '../../lib/magic';
import jwt from 'jsonwebtoken';
import { isNewUser, createNewUser } from '../../lib/db/hasura';
import { setTokenCookie } from '../../lib/cookies';

export default async function login(req, res) {
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.substr(7);

      const metadata = await magicAdmin.users.getMetadataByToken(token);
      const hasuraJWT = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['user', 'admin'],
            'x-hasura-default-role': 'user',
            'x-hasura-user-id': `${metadata.issuer}`,
          },
        },
        process.env.HASURA_SECRET_KEY
      );

      if (await isNewUser(hasuraJWT, metadata.issuer))
        await createNewUser(hasuraJWT, metadata);

      await setTokenCookie(hasuraJWT, res);

      res.status(200).json({ done: true });
    } catch (error) {
      console.log('Something Went Wrong Loggin In');
      res.status(500).json(error);
    }
  } else {
    res.send();
  }
}
