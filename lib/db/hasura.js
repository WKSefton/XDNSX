export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      email
      id
      issuer
    }
  }
`;

  const resp = await queryHasuraGraphQL(
    operationsDoc,
    'isNewUser',
    { issuer },
    token
  );

  return resp?.data?.users?.length === 0;
}
export async function createNewUser(token, metadata) {
  const operationsDoc = `
  mutation createNewUser($email: String!, $issuer: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, public_address: $publicAddress}) {
      returning {
        id
        email
        issuer
      }
    }
  }  
`;
  const { issuer, email, publicAddress } = metadata;

  const resp = await queryHasuraGraphQL(
    operationsDoc,
    'createNewUser',
    { email, issuer, publicAddress },
    token
  );
  
  return resp;
}

export async function queryHasuraGraphQL(
  operationsDoc,
  operationName,
  variables,
  token
) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}
