<template>
  <div id="app font-sans">
    <header class="container mx-auto text-center py-4">
      <router-link
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded outline-none focus:shadow-outline mr-4"
        to="/"
      >
        Home
      </router-link>

      <a
        v-if="currentUser"
        class="bg-transparent text-red-500 border border-red-500 font-bold py-2 px-4 rounded outline-none focus:shadow-outline mr-4"
        href="sign-out"
        @click.prevent="signOut"
      >
        Sign Out
      </a>
      <a
        v-else
        class="bg-transparent text-green-500 border border-green-500 font-bold py-2 px-4 rounded outline-none focus:shadow-outline mr-4"
        href="sign-in"
        @click.prevent="signIn"
      >
        Sign In
      </a>
    </header>

    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import { CURRENT_USER } from '@/graphql/documents/queries';
import { useQuery, useResult } from '@vue/apollo-composable';
import { createComponent } from '@vue/composition-api';

const App = createComponent({
  setup(props, ctx) {
    const { result } = useQuery(CURRENT_USER);
    const currentUser = useResult(result, false);

    const signIn = () => ctx.root.$auth.signIn();
    const signOut = () => ctx.root.$auth.signOut();

    return {
      currentUser,
      signIn,
      signOut,
    };
  },
});

export default App;
</script>
