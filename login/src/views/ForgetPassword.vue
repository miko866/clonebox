<template>
  <section class="content pa-5">
    <h1>{{ $t('passwordForget.title') }}</h1>
    <p class="pb-2">{{ $t('passwordForget.text') }}</p>
    <v-btn small :to="`/${$i18n.locale}/login`">{{ $t('passwordForget.btn') }}</v-btn>
  </section>
</template>

<script>
export default {
  name: 'ForgetPassword',
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
@import 'src/assets/style/views/ForgetPassword';
</style>
