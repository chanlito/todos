<template>
  <div v-if="currentUser">
    <p class="text-center my-4">
      Welcome, {{ currentUser.firstName || currentUser.email }}
    </p>
    <todos-list />
  </div>

  <div v-else>
    <p>You're not signed in!</p>
  </div>
</template>

<script lang="ts">
import { CURRENT_USER } from '@/graphql/documents/queries';
import { createComponent } from '@vue/composition-api';
import { useQuery, useResult } from '@vue/apollo-composable';

import TodosList from '@/components/TodosList.vue';

const Home = createComponent({
  components: {
    TodosList,
  },
  setup() {
    const { result: currentUserQueryResult } = useQuery(CURRENT_USER);
    const currentUser = useResult(currentUserQueryResult);
    return { currentUser };
  },
});

export default Home;
</script>
