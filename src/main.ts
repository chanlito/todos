import './registerServiceWorker';

import { DefaultApolloClient } from '@vue/apollo-composable';
import VueCompositionApi, { provide } from '@vue/composition-api';
import Vue from 'vue';

import App from './App.vue';
import { apolloClient } from './plugins/apollo';
import AuthPlugin from './plugins/auth';
import router from './router';

Vue.use(AuthPlugin);
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

const app = new Vue({
  router,
  render: h => h(App),
  setup() {
    provide(DefaultApolloClient, apolloClient);
    return {};
  },
});

app.$mount('#app');
