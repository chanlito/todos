import data from '@/graphql/data';
import resolvers from '@/graphql/resolvers';
import typeDefs from '@/graphql/typeDefs';
import { auth } from '@/plugins/auth';
import { ApolloClient } from '@8base/apollo-client';

export const apolloClient = new ApolloClient({
  authProfileId: process.env.VUE_APP_8BASE_AUTH_PROFILE_ID,
  connectToDevTools: true,
  getAuthState: () => auth.authClient.getState(),
  onAuthError: err => console.log('Oh shit!', err),
  onAuthSuccess: () => console.log('Awesome!'),
  resolvers,
  typeDefs,
  uri: `https://api.8base.com/${process.env.VUE_APP_8BASE_WORKSPACE_ID}`,
  withAuth: true,
  withSubscriptions: true,
});

apolloClient.writeData({ data: data() });
