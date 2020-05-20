<template>
  <section class="container">
    <h1 class="display-2 pt-5 pb-5 d-flex justify-center">{{ $t('terms.title') }}</h1>

    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, alias, autem consectetur
      deleniti dolorem ducimus exercitationem explicabo facere fuga fugit id obcaecati porro
      possimus praesentium quaerat repudiandae similique vitae voluptate? Lorem ipsum dolor sit
      amet, consectetur adipisicing elit. Accusamus, alias, autem consectetur Lorem ipsum dolor sit
      amet, consectetur adipisicing elit. Accusamus, alias, autem consectetur deleniti dolorem
      ducimus exercitationem explicabo facere fuga fugit id obcaecati porro possimus praesentium
      quaerat repudiandae similique vitae voluptate? Lorem ipsum dolor sit amet, consectetur
      adipisicing elit. Accusamus, alias, autem consectetur Lorem ipsum dolor sit amet, consectetur
      adipisicing elit. Accusamus, alias, autem consectetur deleniti dolorem ducimus exercitationem
      explicabo facere fuga fugit id obcaecati porro possimus praesentium quaerat repudiandae
      similique vitae voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </p>

    <p>
      Accusamus, alias, autem consectetur Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Accusamus, alias, autem consectetur deleniti dolorem ducimus exercitationem explicabo facere
      fuga fugit id obcaecati porro possimus praesentium quaerat repudiandae similique vitae
      voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, alias, autem
      consectetur Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, alias, autem
      consectetur deleniti dolorem ducimus exercitationem explicabo facere fuga fugit id obcaecati
      porro possimus praesentium quaerat repudiandae similique vitae voluptate? Lorem ipsum dolor
      sit amet, consectetur adipisicing elit. Accusamus, alias, autem consectetur Lorem ipsum dolor
      sit amet, consectetur adipisicing elit. Accusamus, alias, autem consectetur deleniti dolorem
      ducimus exercitationem explicabo facere fuga fugit id obcaecati porro possimus praesentium
      quaerat repudiandae similique vitae voluptate? Lorem ipsum dolor sit amet, consectetur
      adipisicing elit. Accusamus, alias, autem consectetur Lorem ipsum dolor sit amet, consectetur
      adipisicing elit. Accusamus, alias, autem consectetur deleniti dolorem ducimus exercitationem
      explicabo facere fuga fugit id obcaecati porro possimus praesentium quaerat repudiandae
      similique vitae voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </p>

    <p class="pb-5">
      Accusamus, alias, autem consectetur Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      Accusamus, alias, autem consectetur deleniti dolorem ducimus exercitationem explicabo facere
      fuga fugit id obcaecati porro possimus praesentium quaerat repudiandae similique vitae
      voluptate? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, alias, autem
      consectetur Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, alias, autem
      consectetur deleniti dolorem ducimus exercitationem explicabo facere fuga fugit id obcaecati
      porro possimus praesentium quaerat repudiandae similique vitae voluptate? Lorem ipsum dolor
      sit amet, consectetur adipisicing elit. Accusamus, alias, autem consectetur
    </p>

    <v-btn small onclick="window.close()">{{ $t('terms.btn') }}</v-btn>
  </section>
</template>

<script>
export default {
  name: 'Terms',
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
@import './src/assets/style/App';
</style>
