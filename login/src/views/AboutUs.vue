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
              <h1 class="font-weight-bold display-1 text-none ma-0  pl-3">CloneBox</h1>
            </router-link>
          </div>
          <!-- END Logo -->

          <div class="general__nav--menu">
            <router-link
              :to="`/${$i18n.locale}/individuals`"
              tag="li"
              class="hover black--text pr-6"
            >
              {{ $t('navbar.individual') }}
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

            <!-- START Languages -->
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
            <!-- END Languages -->
          </div>
        </nav>
      </v-col>
      <!-- END Navbar -->

      <v-col class="aboutUs pa-0" xs="12" sm="12" md="12" lg="12" xl="12">
        <div class="aboutUs__upper">
          <h2 class="aboutUs__upper--title white--text">{{ $t('aboutUs.title') }}</h2>
          <h1 class="aboutUs__upper--subtitle white--text text-none">
            {{ $t('aboutUs.subtitle') }}
          </h1>
        </div>
      </v-col>
      <v-col class="aboutUs__lower">
        <div>
          <h1 class="aboutUs__lower--title text-none">{{ $t('aboutUs.story.title') }}</h1>
          <h2 class="aboutUs__lower--subtitle">
            {{ $t('aboutUs.story.subtitle') }}
          </h2>
          <p>
            Donec commodo luctus lacus, egestas mattis ante viverra at. Pellentesque varius auctor
            blandit. Curabitur sed facilisis nisl, in egestas quam. Proin scelerisque nisl ornare,
            venenatis ipsum non, venenatis mi. Aenean ut leo nisl. Nullam condimentum aliquam leo
            vel tristique. Aenean tincidunt urna vitae orci mattis pretium.
          </p>
          <p>
            Maecenas ultrices magna posuere lacus rhoncus bibendum. Curabitur et leo et lectus
            lacinia euismod nec ut augue. Nulla eget varius mi, non sagittis odio. Proin id odio
            mauris. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos. Praesent in gravida arcu, et sollicitudin justo. Mauris aliquet varius
            placerat. Quisque cursus accumsan risus. Morbi ac eros tellus. Fusce nec finibus nunc.
            Sed gravida metus a enim ultrices mollis. Integer placerat sem enim. Mauris consectetur
            nisl neque, in finibus orci consequat faucibus. Cras suscipit blandit condimentum.
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import germanImg from '@/assets/img/flags/German.png';
import englishImg from '@/assets/img/flags/English.png';

export default {
  name: 'AboutUs',

  data: () => ({
    germanImg,
    englishImg,
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
@import 'src/assets/style/views/AboutUs';
</style>
