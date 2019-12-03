import { USER_SIGN_UP } from '@/graphql/documents/mutations';
import { GET_CURRENT_USER } from '@/graphql/documents/queries';
import { apolloClient } from '@/plugins/apollo';
import { Auth as Auth8base, AUTH_STRATEGIES } from '@8base/auth';
import { WebAuth0AuthClient } from '@8base/web-auth0-auth-client';
import { QueryOptions } from 'apollo-client';
import { PluginObject, VueConstructor } from 'vue';

class Auth {
  authClient = Auth8base.createClient(
    { strategy: AUTH_STRATEGIES.WEB_8BASE },
    {
      domain: process.env.VUE_APP_8BASE_AUTH_DOMAIN,
      clientId: process.env.VUE_APP_8BASE_AUTH_CLIENT_ID,
      redirectUri: `${window.location.origin}/auth/callback`,
      logoutRedirectUri: `${window.location.origin}/`,
    },
  ) as WebAuth0AuthClient;

  get isSignedIn() {
    const authState = this.authClient.getState();
    return !!authState?.token && !this.isTokenExpired;
  }

  get isTokenExpired() {
    const authState = this.authClient.getState();
    const now = Date.now() / 1000;
    return authState?.tokenPayload?.exp < now;
  }

  signIn() {
    this.authClient.authorize();
  }

  signOut() {
    this.authClient.logout();
  }

  async handleCallback() {
    const result = await this.authClient.getAuthorizedData();

    if (!result.idToken) return;

    const authState = {
      currentUser: null,
      token: result.idToken,
      tokenPayload: result.idTokenPayload,
      workspaceId: process.env.VUE_APP_8BASE_WORKSPACE_ID,
    };

    this.authClient.setState({ ...authState });

    // we check with 8base to see if this user already exists
    let currentUser = await this.currentUser({
      fetchPolicy: 'no-cache',
    });

    // otherwise we sign up a new user.
    if (!currentUser) {
      const signUpResult = await apolloClient.mutate({
        mutation: USER_SIGN_UP,
        variables: {
          authProfileId: process.env.VUE_APP_8BASE_AUTH_PROFILE_ID,
          user: { email: result.email },
        },
      });
      currentUser = signUpResult.data.userSignUpWithToken;
    }

    this.authClient.setState({ ...authState, currentUser });

    apolloClient.writeData({ data: { currentUser, token: authState.token } });
  }

  async currentUser(options?: Partial<QueryOptions<{}>>) {
    const { data } = await apolloClient.query({
      query: GET_CURRENT_USER,
      errorPolicy: 'ignore',
      ...options,
    });
    return data?.currentUser;
  }
}

export const auth = new Auth();

const authPlugin: PluginObject<{}> = {
  install(V: VueConstructor) {
    V.prototype.$auth = auth;
  },
};

export default authPlugin;

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth;
  }
}
