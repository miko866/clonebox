<template>
  <v-container fluid class="pa-0">
    <v-row class="pa-0">
      <!-- START Navbar -->
      <v-col class="general pa-0" xs="12" sm="12" md="12" lg="12" xl="12">
        <nav class="general__nav">
          <!-- START Logo -->
          <div class="general__nav--icon">
            <router-link :to="`/${$i18n.locale}/`" class="general__nav--a">
              <v-icon class="general__nav--logo" color="#327BED" x-large>
                mdi-cloud-circle
              </v-icon>
              <h1 class="font-weight-bold display-1 text-none ma-0 pl-3">CloneBox</h1>
            </router-link>
          </div>
          <!-- END Logo -->

          <div class="general__nav--menu">
            <router-link :to="`/${$i18n.locale}/aboutUs`" tag="li" class="hover black--text pr-6">
              {{ $t('navbar.aboutUs') }}
            </router-link>
            <router-link :to="`/${$i18n.locale}/login`" tag="li" class="hover black--text">
              {{ $t('authForm.signIn') }}
            </router-link>
            <router-link
              :to="`/${$i18n.locale}/register`"
              tag="li"
              class="hover black--text pl-6 pr-6"
            >
              {{ $t('authForm.signUp') }}
            </router-link>
            <div class="general__nav--language">
              <ul class="pa-0">
                <li class="hover">
                  <img :src="germanImg" @click="setLocale('de')" />
                </li>
                <li class="hover">
                  <img :src="englishImg" @click="setLocale('en')" />
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </v-col>
      <!-- END Navbar-->

      <!-- START Content -->
      <v-col class="individuals__upper" xs="12" sm="12" md="12" lg="12" xl="12">
        <div class="individuals__upper--content">
          <div class="individuals__upper--text pt-12 pb-12">
            <h2 class="individuals__upper--subtitle">
              {{ $t('individual.headerTitle') }}
            </h2>
            <h1 class="individuals__upper--title text-none">
              {{ $t('individual.title') }}
            </h1>
            <p class="individuals__upper--paragraph">
              {{ $t('individual.subtitle') }}
            </p>
          </div>

          <!-- START Only image -->
          <div class="individuals__upper--picture">
            <v-img :src="img"></v-img>
          </div>
          <!-- END Only image -->
        </div>
      </v-col>
      <!-- START White Space -->
      <v-col class="individuals__whitespace" xs="12" sm="12" md="12" lg="12" xl="12"></v-col>
      <!-- END White Space -->
      <v-col class="individuals__lower" xs="12" sm="12" md="12" lg="12" xl="12">
        <div class="individuals__lower--content pt-12 pb-12">
          <h1 class="individuals__lower--subtitle">
            {{ $t('individual.plan.title') }}
          </h1>
          <p class="individuals__lower--paragraph">
            {{ $t('individual.plan.text') }}
          </p>
        </div>
      </v-col>
      <!-- END Content -->
    </v-row>
  </v-container>
</template>

<script>
import germanImg from '@/assets/img/flags/German.png';
import englishImg from '@/assets/img/flags/English.png';
import img from '@/assets/img/sample/img.png';

export default {
  name: 'ForIndividuals',

  data: () => ({
    englishImg,
    germanImg,
    img,
  }),

  methods: {
    // Change languages and routes too
    setLocale(locale) {
      this.$i18n.locale = locale;
      this.$router.push({ params: { lang: locale } }).catch((error) => {
        console.error('Error from router locales', error);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/style/views/ForIndividuals';
</style>
