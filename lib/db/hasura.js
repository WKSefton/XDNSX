export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users_by_pk(issuer: $issuer) {
      id
      email
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

  return resp?.users?.length === 0;
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
