import gql from 'graphql-tag';

import { TodoFields, UserFields } from './fragments';

export const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    todoCreate(data: { title: $title }) {
      ...TodoFields
    }
  }
  ${TodoFields}
`;

export const CHANGE_TODO_STATUS = gql`
  mutation ChangeTodoStatus($id: ID!, $status: String) {
    todoUpdate(data: { status: $status }, filter: { id: $id }) {
      ...TodoFields
    }
  }
  ${TodoFields}
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    todoDelete(data: { id: $id }) {
      success
    }
  }
`;

export const USER_SIGN_UP = gql`
  mutation UserSignUp($authProfileId: ID, $user: UserCreateInput!) {
    userSignUpWithToken(authProfileId: $authProfileId, user: $user) {
      ...UserFields
    }
  }
  ${UserFields}
`;
