<template>
  <!-- Show only for logged user -->
  <v-app v-if="logged === true">
    <v-container fluid fill-height class="pa-0 pb-1" v-if="logged === true">
      <router-view v-if="logged === true" />
    </v-container>
  </v-app>
</template>

<script>
import UserController from '@/controllers/UserController';

export default {
  name: 'App',
  data: () => ({
    logged: false, // beforeCreated, depends on token
  }),

  async beforeCreate() {
    // Take token from cookies
    const token = $cookies.get('token');

    // Check empty or undefined
    if (!token || token === undefined || token === '') {
      this.logged = false;
      $cookies.remove('token');
      // Redirect to login
      location.replace(process.env.VUE_APP_LOGIN);
    } else {
      await UserController.verifyUser({
        token: token,
      })
        .then((response) => {
          // If have token, response true, then save it into localStorage
          if (response.data.status === 'true') {
            this.logged = true;
            const tokenData = JSON.stringify(response.data.message);

            sessionStorage.setItem('user', tokenData);
          } else {
            this.logged = false;
            $cookies.remove('token');
            // Redirect to login
            location.replace(process.env.VUE_APP_LOGIN);
          }
        })
        .catch((err) => {
          this.logged = false;
          $cookies.remove('token');
          // Redirect to login
          location.replace(process.env.VUE_APP_LOGIN);
        });
    }
  },
};
</script>
