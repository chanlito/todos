import { auth } from '@/plugins/auth';

function data() {
  const authState = auth.authClient.getState();

  return {
    currentUser: authState.currentUser || null,
    token: authState.token || null,
  };
}

export default data;
