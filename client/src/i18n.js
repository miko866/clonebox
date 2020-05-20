import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// Load @/locales file with languages sets
function loadLocaleMessages() {
  // Read context
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages = {};
  // Find matches language set and use that one
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

// Language of the browser UI.
let language = window.navigator.userLanguage || window.navigator.language;
// Use that
let currentLanguage = language.slice(0, 2);

// Exports VueI18n settings global
export default new VueI18n({
  locale: currentLanguage,
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});
