<template>
  <v-layout class="dashboard">
    <v-row class="dashboard__content pt-3 container">
      <!-- START Navbar -->
      <v-col xs="12" sm="12" md="12" lg="12" xl="12" style="height: 7em">
        <nav class="dashboard__nav">
          <!-- START Logo -->
          <div class="dashboard__nav--icon">
            <router-link :to="`/${$i18n.locale}/`" class="a-link-icon">
              <v-icon class="dashboard__menu--logo pr-3" color="#fbe7b1" x-large
                >mdi-cloud-circle</v-icon
              >
              <h1 class="display-1 font-weight-bold text-none white--text">CloneBox</h1>
            </router-link>
          </div>
          <!-- END Logo -->

          <!-- START Nav link -->
          <div class="dashboard__nav--menu">
            <router-link
              :to="`/${$i18n.locale}/individuals`"
              tag="li"
              class="hover white--text"
              style="padding-right: 3em;"
              >{{ $t('navbar.individual') }}</router-link
            >
            <router-link :to="`/${$i18n.locale}/aboutUs`" tag="li" class="hover white--text">
              {{ $t('navbar.aboutUs') }}</router-link
            >
          </div>
          <!-- END Nav link -->
        </nav>
      </v-col>
      <!-- END Navbar-->

      <!-- START Content -->
      <v-col xs="12" sm="12" md="12" lg="12" xl="12" style="height: 45em">
        <section>
          <h1 class="display-3 text-none  dashboard__title">
            {{ $t('dashboard.title1') }} <br />
            {{ $t('dashboard.title2') }} <br />
            {{ $t('dashboard.title3') }}
          </h1>

          <p class="title white--text dashboard__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla suscipit facilisis arcu
            efficitur placerat. Ut eu rhoncus nunc, nec ultricies urna.
          </p>
        </section>
      </v-col>
      <!-- END Content -->
    </v-row>

    <!-- Find which component is active and change them  -->
    <RouterView />
  </v-layout>
</template>

<script>
export default {
  name: 'Dashboard',

  data: () => ({
    login: true, // change components
  }),
};
</script>

<style lang="scss" scoped>
@import './src/assets/style/views/Dashboard';
</style>
