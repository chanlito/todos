import gql from 'graphql-tag';

export const TodoFields = gql`
  fragment TodoFields on Todo {
    id
    title
    description
    status
    createdBy {
      id
    }
  }
`;

export const UserFields = gql`
  fragment UserFields on User {
    id
    email
    status
    firstName
    lastName
    avatar {
      previewUrl
    }
  }
`;
