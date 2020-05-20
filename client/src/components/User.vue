<template>
  <div class="user pa-2">
    <!-- Start User profile-->
    <section class="user__profile">
      <v-card @click="userProfile = true" flat class="user__profile--avatar" hover>
        <v-list-item>
          <!-- START User image -->
          <v-list-item-avatar size="70">
            <v-img :src="avatar" alt="avatar"></v-img>
          </v-list-item-avatar>
          <!-- END User image -->

          <!-- START User info -->
          <v-list-item-content>
            <v-list-item-title class="headline">{{ firstName }} {{ lastName }}</v-list-item-title>
            <v-list-item-subtitle>{{ organizationName }}</v-list-item-subtitle>
          </v-list-item-content>
          <!-- END User info -->
        </v-list-item>
      </v-card>
    </section>
    <!-- End User profile-->

    <!-- Start Dialog user settings -->
    <v-dialog max-width="400" v-model="userProfile" class="dialog__position">
      <v-card>
        <!-- START Card title -->
        <v-card-title>
          <v-list-item>
            <!-- START User image -->
            <v-list-item-avatar size="70">
              <v-img :src="avatar" alt="avatar"></v-img>
            </v-list-item-avatar>
            <!-- END User image -->

            <!-- START User Content -->
            <v-list-item-content>
              <v-list-item-title class="headline">{{ $t('user.settings') }}</v-list-item-title>
              <v-list-item-title
                class="subtitle-2 user__profile--avatarChange"
                @click="avatarChange = true"
                style="color: #327BED"
                >{{ $t('user.changeImage') }}</v-list-item-title
              >

              <div class="user-progress pt-2">
                <p class="subtitle-1">
                  {{ $t('user.storage') }}: <br /><span class="caption"
                    >{{ currentStorage }}MB {{ $t('user.used') }} 2000MB</span
                  >
                </p>
                <v-progress-linear
                  background-color="#f6f6f6"
                  color="#7e8994"
                  :value="currentStorageValue"
                ></v-progress-linear>
              </div>
            </v-list-item-content>
            <!-- END User Content -->
          </v-list-item>
        </v-card-title>
        <!-- END Card title -->

        <v-card-actions class="pl-5 pb-3">
          <v-btn text width="120" @click="logout">{{ $t('button.signOut') }}</v-btn>
          <v-btn text width="120" @click="userProfile = false">{{ $t('button.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END Dialog user settings -->

    <!-- Start Dialog user change image -->
    <v-dialog max-width="400" v-model="avatarChange" transition="fab-transition">
      <v-card>
        <v-card-title>
          <v-list-item>
            <!-- Start User image -->
            <v-list-item-avatar size="70">
              <v-img :src="avatar" alt="avatar"></v-img>
            </v-list-item-avatar>
            <!-- END User image -->

            <v-progress-circular
              indeterminate
              color="primary"
              v-if="progressSaveAvatar"
            ></v-progress-circular>

            <v-list-item-content>
              <v-file-input v-model="file" accept="image/*" label="select Picture"></v-file-input>
            </v-list-item-content>
          </v-list-item>
        </v-card-title>

        <!-- START Buttons -->
        <v-card-actions class="pl-5 pb-3">
          <v-btn color="primary" width="120" @click="saveAvatar">{{ $t('button.save') }}</v-btn>
          <v-btn text width="120" @click="avatarChange = false">{{ $t('button.cancel') }}</v-btn>
        </v-card-actions>
        <!-- END Buttons -->
      </v-card>
    </v-dialog>
    <!-- END Dialog user change image -->
  </div>
</template>

<script>
import axios from 'axios';
import AvatarController from '@/controllers/AvatarController';
import OrganizationController from '@/controllers/OrganizationController';

// Default user avatar
import Gandalf from '../assets/img/defaultUser/gandalf.png';

export default {
  name: 'User',

  data: () => ({
    file: '', // saveAvatar() for image
    progressSaveAvatar: false, // saveAvatar()

    userProfile: false, // open user settings dialog
    avatarChange: false, // user settings dialog

    avatar: Gandalf, // for base64 image

    currentStorage: 0, // mounted, user settings
    currentStorageValue: 0, // mounted, user settings

    userId: 0, // mounted from token
    firstName: '', // mounted from token
    lastName: '', // mounted from token
    organizationHash: '', // mounted from token
    organizationName: '', // mounted from token
  }),

  async mounted() {
    // Take current user data and convert it from string to JSON
    const user = JSON.parse(sessionStorage.getItem('user'));

    // Take data from user
    this.userId = user.userId;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.organizationHash = user.organizationHash;
    this.organizationName = user.organizationName;

    // Storage quota
    await OrganizationController.getStorage({
      organizationHash: user.organizationHash,
    })
      .then((response) => {
        this.currentStorage = response.data.message;
        this.currentStorageValue = this.currentStorage * 0.05;
      })
      .catch((err) => {
        console.error('Error: ', err);
      });

    // User avatar link
    let avatar = user.avatar;
    if (avatar === '') {
      avatar = sessionStorage.getItem('avatar');
    }

    if (avatar !== '') {
      // Get avatr from server depends on avatar link
      await AvatarController.getAvatar({
        avatar: avatar,
      })
        .then((response) => {
          // Save avatar from server storage
          this.avatar = response.data.message;
        })
        .catch((err) => {
          console.error('Error from getAvatar: ', err);
        });
    }
  },

  methods: {
    async saveAvatar() {
      this.progressSaveAvatar = true;
      // create a new FileReader to read this image and convert to base64 format
      const fr = new FileReader();
      // Start the reader job - read file as a data url (base64 format)
      fr.readAsDataURL(this.file);
      // Define a callback function to run, when FileReader finishes its job
      fr.addEventListener('load', () => {
        this.avatar = fr.result;
      });

      // Create FormData with user avatar
      const formData = new FormData();
      formData.append('file', this.file);

      // Send image on Server
      await axios
        .post(process.env.VUE_APP_SERVER + '/avatar/', formData, {
          timeout: 50000,
          headers: {
            'Content-Type': 'multipart/form-data',
            userid: this.userId,
            organizationhash: this.organizationHash,
            authorization: $cookies.get('token'),
          },
        })
        .then((response) => {
          sessionStorage.setItem('avatar', response.data.message);

          this.avatarChange = false;
          this.progressSaveAvatar = false;
        })
        .catch((err) => {
          console.error('Upload avatar Error: ', err);
        });
    },

    logout() {
      // Remove token
      $cookies.remove('token');
      // Remove all saved data from sessionStorage
      sessionStorage.clear();
      // Redirect to login
      location.replace(process.env.VUE_APP_LOGIN);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/style/components/User';
</style>
