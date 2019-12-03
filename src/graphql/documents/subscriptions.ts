import gql from 'graphql-tag';

import { TodoFields } from './fragments';

export const SUBSCRIBE_TO_TODOS = gql`
  subscription SubscribeToTodos {
    Todos {
      mutation
      node {
        ...TodoFields
      }
      previousValues {
        id
      }
    }
  }
  ${TodoFields}
`;
