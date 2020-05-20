<template>
  <v-app>
    <v-container fluid fill-height class="pa-0">
      <router-view />
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({}),
};
</script>
<style lang="scss" scoped></style>
