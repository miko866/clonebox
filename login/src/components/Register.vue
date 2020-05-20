<template>
  <!-- @keyup.enter -> Push Enter do triggert to register() -->
  <v-row class="remove-margin container login" style="padding-bottom: 0;" @keyup.enter="register">
    <v-col>
      <section class="auth-link">
        <router-link class="hover" :to="`/${$i18n.locale}/login`">{{
          $t('authForm.signIn')
        }}</router-link>
      </section>

      <!-- START Form -->
      <section class="auth-form">
        <h2 class="font-weight-bold">{{ $t('authForm.signUp') }}</h2>

        <v-form ref="form" autocomplete="off">
          <v-text-field
            v-model.trim="firstName"
            :label="$t('authForm.firstName')"
            required
            :error-messages="firstNameError"
            @input="$v.firstName.$touch()"
            @blur="$v.firstName.$touch()"
          ></v-text-field>

          <v-text-field
            v-model.trim="lastName"
            :label="$t('authForm.lastName')"
            required
            :error-messages="lastNameError"
            @input="$v.lastName.$touch()"
            @blur="$v.lastName.$touch()"
          ></v-text-field>

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
            autocomplete="off"
            :error-messages="passwordError"
            @input="$v.password.$touch()"
            @blur="$v.password.$touch()"
          ></v-text-field>

          <v-text-field
            v-model.trim="password2"
            :label="$t('authForm.repeatPassword')"
            type="password"
            required
            autocomplete="off"
            :error-messages="password2Error"
            @input="$v.password2.$touch()"
            @blur="$v.password2.$touch()"
          ></v-text-field>

          <v-text-field
            v-model.trim="organization"
            :label="$t('authForm.organization')"
            required
            :error-messages="organizationError"
            @input="$v.organization.$touch()"
            @blur="$v.organization.$touch()"
          ></v-text-field>

          <!-- START New organization -->
          <v-checkbox v-model="newOrganization">
            <template v-slot:label>
              <div>
                {{ $t('authForm.newOrganization') }}
              </div>
            </template>
          </v-checkbox>
          <!-- END New organization -->

          <!-- START Terms -->
          <v-checkbox
            v-model="terms"
            :error-messages="termsError"
            @input="$v.terms.$touch()"
            @blur="$v.terms.$touch()"
          >
            <template v-slot:label>
              <div class="checkbox-text-position">
                {{ $t('authForm.terms.title') }}
                <a target="_blank" :href="`/${$i18n.locale}/terms`" @click.stop>
                  <br /><span style="font-size: .6em;"> {{ $t('authForm.terms.subtitle') }}</span>
                </a>
              </div>
            </template>
          </v-checkbox>
          <!-- END Terms -->

          <v-btn class="mt-5 auth-button white--text" color="#327bed" @click="register">
            {{ $t('authForm.signUp') }}
          </v-btn>
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

      <!-- START Language -->
      <section class="language" style="padding-top: 3em;">
        <ul class="pa-0">
          <li class="hover">
            <img :src="germanImg" @click="setLocale('de')" />
          </li>
          <li class="hover">
            <img :src="englishImg" @click="setLocale('en')" />
          </li>
        </ul>
      </section>
      <!-- END Language -->
    </v-col>
  </v-row>
</template>

<script>
import OrganizationController from '@/controllers/OrganizationController';
import UserController from '@/controllers/UserController';
import { sanitize, randomHash } from '@/helpers.js';

// Import languages images
import germanImg from '@/assets/img/flags/German.png';
import englishImg from '@/assets/img/flags/English.png';

// Validation imports
import { validationMixin } from 'vuelidate';
import { required, sameAs, minLength, email } from 'vuelidate/lib/validators';

export default {
  name: 'Register',

  mixins: [validationMixin],
  validations: {
    firstName: { required, minLength: minLength(3) },
    lastName: { required, minLength: minLength(3) },
    email: { required, email },
    organization: { required, minLength: minLength(3) },
    password: { required, minLength: minLength(3) },
    password2: { sameAs: sameAs('password'), required },
    terms: { sameAs: sameAs(() => true) },
  },

  data: () => ({
    germanImg,
    englishImg,

    firstName: '', // v-model form
    lastName: '', // v-model form
    email: '', // v-model form
    password: '', // v-model form
    password2: '', // v-model form
    organization: '', // v-model form
    newOrganization: false, // v-model checkbox
    terms: false, // v-model checkbox

    createdOrganizationData: {}, // server response data
    createdUserData: {}, // server response data

    errorMessage: '', // response error
    showAlert: false, // response error alert
  }),

  computed: {
    // Customs error message for validation input -> require && minLength
    firstNameError() {
      const error = [];
      if (!this.$v.firstName.$dirty) return error;
      !this.$v.firstName.required && error.push(this.$t('validation.firstName'));
      !this.$v.firstName.minLength && error.push(this.$t('validation.letter'));
      return error;
    },
    // Customs error message for validation input -> require && minLength
    lastNameError() {
      const error = [];
      if (!this.$v.lastName.$dirty) return error;
      !this.$v.lastName.required && error.push(this.$t('validation.lastName'));
      !this.$v.lastName.minLength && error.push(this.$t('validation.letter'));
      return error;
    },
    // Customs error message for validation input -> require && email
    emailError() {
      const error = [];
      if (!this.$v.email.$dirty) return error;
      !this.$v.email.required && error.push(this.$t('validation.email'));
      !this.$v.email.email && error.push(this.$t('validation.checkEmail'));
      return error;
    },
    // Customs error message for validation input -> require && minLength
    organizationError() {
      const error = [];
      if (!this.$v.organization.$dirty) return error;
      !this.$v.organization.required && error.push(this.$t('validation.organization'));
      !this.$v.organization.minLength && error.push(this.$t('validation.letter'));
      return error;
    },
    // Costoms error message for validation input one special character, one number , one letter Uppercase && required
    // && minLength
    passwordError() {
      const error = [];
      if (!this.$v.password.$dirty) return error;
      !this.$v.password.required && error.push(this.$t('validation.password'));
      !this.$v.password.minLength && error.push(this.$t('validation.letter'));
      return error;
    },
    // Customs error message for validation input -> sameAs (the same password && password2) && required
    password2Error() {
      const error = [];
      if (!this.$v.password2.$dirty) return error;
      !this.$v.password2.sameAs && error.push(this.$t('validation.samePassword'));
      !this.$v.password2.required && error.push(this.$t('validation.passwordRepeat'));
      return error;
    },
    // Customs error message for validation input -> sameAs (terms === true)
    termsError() {
      const error = [];
      if (!this.$v.terms.$dirty) return error;
      !this.$v.terms.sameAs && error.push(this.$t('validation.terms'));
      return error;
    },
  },

  methods: {
    async register(event) {
      // If have validation errors show there
      this.$v.$touch();

      // Create new organization
      if (this.newOrganization === true) {
        // Create random hash for organization
        const hash = randomHash(15);

        await OrganizationController.createOrganization({
          name: sanitize(this.organization),
          password: this.password,
          memory: 2000,
          hash: hash,
        })
          .then((response) => {
            this.createdOrganizationData = response.data.message;
          })
          .catch((err) => {
            // Set error message and show alert with message
            this.errorMessage = this.$t('error.organization');
            this.showAlert = true;

            // Timer for message
            let timer = this.register.timer;
            if (timer) {
              clearTimeout(timer);
            }
            // Show message
            this.register.timer = setTimeout(() => {
              this.showAlert = false;
            }, 3500);
          });
      }

      // Create new user only if is no error from organization
      if (this.showAlert === false) {
        // Create new user
        await UserController.createUser({
          first_name: sanitize(this.firstName),
          last_name: sanitize(this.lastName),
          email: sanitize(this.email),
          avatar: '',
          password: this.password,
          organization_name: sanitize(this.organization),
        })
          .then((response) => {
            this.createdUserData = response.data.message;

            // Redirect to Login with url params
            this.$router
              .push({
                name: 'Login',
                params: {
                  dialog: true,
                  user: this.createdUserData,
                  organization: this.createdOrganizationData,
                },
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            const errorMessage = err.response.data.message;
            // Set error message and show alert with message
            if (errorMessage === 'Server Error: Error: Email already exists.') {
              this.errorMessage = this.$t('error.emailExists');
            } else if (errorMessage === 'Server Error: Error: No organization with id') {
              this.errorMessage = this.$t('error.noOrganization');
            } else {
              this.errorMessage = this.$t('error.signUp');
            }
            this.showAlert = true;

            // Timer for message
            let timer = this.register.timer;
            if (timer) {
              clearTimeout(timer);
            }
            // Show message
            this.register.timer = setTimeout(() => {
              this.showAlert = false;
            }, 3500);
          });
      }
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
