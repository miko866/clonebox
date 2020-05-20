<template>
  <div class="pa-0 file__selection">
    <section>
      <v-list-item-group>
        <!-- START Upload file -->
        <v-list-item @click="emitType('myFiles')">
          <v-list-item-content>
            <v-list-item-title> {{ $t('fileSelection.myFiles') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- END Upload file -->

        <!-- START New folder -->
        <v-list-item @click="emitType('allFiles')">
          <v-list-item-content>
            <v-list-item-title> {{ $t('fileSelection.allFiles') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </section>

    <!-- Start Language -->
    <section class="language pa-0">
      <ul class="pa-0">
        <li class="hover">
          <img :src="germanImg" @click="setLocale('de')" />
        </li>
        <li class="hover">
          <img :src="englishImg" @click="setLocale('en')" />
        </li>
      </ul>
    </section>
    <!-- End Language -->
  </div>
</template>

<script>
import germanImg from '../assets/img/flags/German.png';
import englishImg from '../assets/img/flags/English.png';

export default {
  name: 'FileSelection',

  data: () => ({
    germanImg,
    englishImg,

    myFile: 'myFile',
    allFile: 'allFile',
  }),

  methods: {
    emitType(type) {
      this.$emit('choosedType', type);
    },

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
@import 'src/assets/style/components/FileSelection';
</style>
