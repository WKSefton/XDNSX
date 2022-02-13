import jwt from "jsonwebtoken";

export async function verifyToken(token) {
  if (token) {
    const decodedToken = jwt.verify(token, process.env.HASURA_SECRET_KEY);

    const userId = decodedToken?.issuer;
    return userId;
  }
  return null;
}