<template>
  <div>Signing in... {{ message }}</div>
</template>

<script lang="ts">
import { createComponent, onMounted, ref } from '@vue/composition-api';

const Callback = createComponent({
  setup(props, ctx) {
    const message = ref<string>(null);

    onMounted(() => {
      ctx.root.$auth
        .handleCallback()
        .then(() => {
          message.value = 'success';
          ctx.root.$router.replace({ name: 'home' });
        })
        .catch(err => {
          message.value = 'failed';
          console.log('Sign In/Up Failed!', err.message);
          ctx.root.$auth.signOut();
        });
    });

    return { message };
  },
});

export default Callback;
</script>
