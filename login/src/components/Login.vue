<template>
  <!-- @keyup.enter -> Push Enter do triggert to login() -->
  <v-row class="remove-margin container login " @keyup.enter="login">
    <!-- START Dialog after register new user -->
    <v-dialog v-model="dialog" max-width="300">
      <v-card>
        <v-card-title class="headline">{{ $t('login.successMessage') }}</v-card-title>

        <v-card-text>
          {{ dialogText }}
        </v-card-text>
        <v-card-text>
          {{ $t('login.title') }}
        </v-card-text>

        <!-- START Button -->
        <v-card-actions class="flex justify-center">
          <v-spacer></v-spacer>
          <v-btn color="#327bed" text @click="dialog = false">
            {{ $t('button.close') }}
          </v-btn>
        </v-card-actions>
        <!-- END Button -->
      </v-card>
    </v-dialog>
    <!-- END Dialog after register new user -->

    <v-col>
      <section class="auth-link">
        <router-link class="hover" :to="`/${$i18n.locale}/register`">{{
          $t('authForm.signUp')
        }}</router-link>
        <router-view></router-view>
      </section>

      <!-- START Form -->
      <section class="auth-form" style="height: 72%;">
        <h2 class="font-weight-bold pb-5">{{ $t('authForm.signIn') }}</h2>

        <v-form ref="form" autocomplete="off">
          <v-text-field
            v-model.trim="email"
            :label="$t('authForm.email')"
            type="email"
            required
            :error-messages="emailError"
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>

          <v-text-field
            v-model.trim="password"
            :label="$t('authForm.password')"
            type="password"
            required
            :error-messages="passwordError"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
          ></v-text-field>

          <v-btn class="mt-5 auth-button white--text" color="#327bed" @click="login"
            >{{ $t('authForm.signIn') }}
          </v-btn>
          <router-link
            :to="`/${$i18n.locale}/forgetPassword`"
            tag="li"
            class="caption hover"
            @click.stop
            >{{ $t('authForm.passwordForget') }}</router-link
          >
        </v-form>
      </section>
      <!-- END Form -->

      <!-- START Alert -->
      <v-alert
        :value="showAlert"
        color="error"
        icon="warning"
        outlined
        style="padding: .5em; margin: unset;"
      >
        {{ errorMessage }}
      </v-alert>
      <!-- END Alert -->

      <!-- START Languages -->
      <section class="language">
        <ul class="pa-0">
          <li class="hover">
            <img :src="germanImg" @click="setLocale('de')" />
          </li>
          <li class="hover">
            <img :src="englishImg" @click="setLocale('en')" />
          </li>
        </ul>
      </section>
      <!-- END Languages -->
    </v-col>
  </v-row>
</template>

<script>
import UserController from '@/controllers/UserController';
import { isEmpty } from '@/helpers.js';

// Import languages images
import germanImg from '@/assets/img/flags/German.png';
import englishImg from '@/assets/img/flags/English.png';

// Validation imports
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';

export default {
  name: 'Login',

  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required },
  },

  data: () => ({
    germanImg,
    englishImg,

    email: '', // v-model
    password: '', // v-model

    user: {}, // login response
    organization: {}, // login response
    dialog: false, // after create new user in register show it

    errorMessage: '', // response error
    showAlert: false, // response error alert
  }),

  computed: {
    // Customs error message for validation input -> require && email
    emailError() {
      const error = [];
      if (!this.$v.email.$dirty) return error;
      !this.$v.email.required && error.push(this.$t('validation.email'));
      !this.$v.email.email && error.push(this.t$('validation.checkEmail'));
      return error;
    },

    // Customs error message for validation input -> require
    passwordError() {
      const error = [];
      if (!this.$v.password.$dirty) return error;
      !this.$v.password.required && error.push(this.$t('validation.password'));
      return error;
    },

    // Choose the current text for only user or user with organization
    dialogText() {
      return !isEmpty(this.organization)
        ? ` ${this.$t('login.registerMessage.text1')}  "${this.user.first_name} ${
            this.user.last_name
          }"
        ${this.$t('login.registerMessage.text2')}  "${this.organization.name}" ${this.$t(
            'login.registerMessage.text3',
          )} `
        : `${this.$t('login.registerMessage.text1')}  "${this.user.first_name} ${
            this.user.last_name
          }" ${this.$t('login.registerMessage.text4')} `;
    },
  },

  mounted() {
    // Check if register params is empty
    // Came data after register new user with or without organization
    if (this.$route.params.user !== undefined) {
      // Take data from params url after create new user and organization
      const params = this.$route.params;
      this.dialog = params.dialog;
      this.user = params.user;
      this.organization = params.organization;

      // Fill user email
      this.email = params.user.email;
    }
  },

  methods: {
    // Change components Login & Register
    signUp(event) {
      this.$emit('clicked', false);
    },

    async login() {
      // If have validation errors show there
      this.$v.$touch();

      await UserController.login({
        email: this.email,
        password: this.password,
      })
        .then((response) => {
          if (response.data.status === 'true') {
            const token = response.data.message;

            // After successfully login create cookies with JWT Token
            const ONE_WEEK = 60 * 60 * 24 * 7;
            // $cookies.set('token', token, '1d', null, null, true);
            $cookies.set('token', token, ONE_WEEK);

            // Redirect to client
            location.replace(process.env.VUE_APP_CLIENT);
            return true;
          } else {
            return false;
          }
        })
        .catch((err) => {
          // Set error message and show alert with message
          this.errorMessage = this.$t('error.signIn');
          this.showAlert = true;

          // Timer for message
          let timer = this.login.timer;
          if (timer) {
            clearTimeout(timer);
          }
          // Show message
          this.login.timer = setTimeout(() => {
            this.showAlert = false;
          }, 3500);

          // Make fields empty
          this.email = '';
          this.password = '';
        });
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
@import './src/assets/style/components/LoginRegister';
</style>
