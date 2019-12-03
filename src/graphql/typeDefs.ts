import gql from 'graphql-tag';

const typeDefs = gql`
  extend type Query {
    currentUser: User
    token: String
  }
`;

export default typeDefs;
