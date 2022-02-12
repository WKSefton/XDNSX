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
export async function createNewProject(token, newProject) {
  const operationsDoc = `
  mutation createNewProject($name: String!, $type: Int!, $data: jsonb!, $description: String!) {
    insert_projects(objects: {name: $name, type: $type, data: $data, description: $description}) {
      returning {
        data
        description
        id
        name
        type
      }
    }
  }
`;

  const { name, type, data, description } = newProject;

  const resp = await queryHasuraGraphQL(
    operationsDoc,
    'createNewProject',
    { name, type, data, description },
    token
  );

  return resp.data;
}

export async function updateProjects(token, project) {
  const operationsDoc = `
  query updateProjects($id: Int!, $name: String!, $type: Int!, $data: jsonb!, $description: String!) {
    projects(where: {id: {_eq: $id}, _set: {name: $name, type: $type, data: $data, description: $description}}) {
      data
      description
      id
      name
      type
    }
  }
`;
  const { id, name, type, data, description } = project;

  const resp = await queryHasuraGraphQL(
    operationsDoc,
    'updateProjects',
    { id, name, type, data, description },
    token
  );

  return resp.data;
}

export async function getProjects(token, userId) {
  const operationsDoc = `
  query getProjects($userId: String!) {
    projects(where: {user_id: {_eq: $userId}}) {
      data
      description
      id
      name
      type
    }
  }
`;

  const resp = await queryHasuraGraphQL(
    operationsDoc,
    'getProjects',
    { "userId": userId },
    token
  );
    console.log(resp)
  return resp.data;
}

export async function createNewUser(token, metaData) {
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
  const { issuer, email, publicAddress } = metaData;

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
