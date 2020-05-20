import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);

Vue.config.productionTip = false;

Vue.$cookies.config('7d');

// Import Internationalization - Translation
import i18n from '@/i18n.js';

// Use beforeEach route guard to set the language
router.beforeEach((to, from, next) => {
  // Use the language from the routing param or default language
  let language = to.params.lang;
  // Default language
  if (!language) {
    language = 'en';
  }
  // Set the current language for i18n.
  i18n.locale = language;
  next();
});

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
