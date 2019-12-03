import gql from 'graphql-tag';

import { UserFields, TodoFields } from './fragments';

export const CURRENT_USER = gql`
  query CurrentUser {
    currentUser @client {
      ...UserFields
    }
  }
  ${UserFields}
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser: user {
      ...UserFields
    }
  }
  ${UserFields}
`;

export const TODOS_LIST = gql`
  query TodosList {
    todosList {
      items {
        ...TodoFields
      }
      count
    }
  }
  ${TodoFields}
`;
