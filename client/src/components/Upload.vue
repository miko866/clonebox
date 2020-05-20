<template>
  <div class="upload pa-0 border">
    <!-- Start Menu -->
    <section class="upload__menu">
      <div>
        <v-list-item-group>
          <!-- START Upload file -->
          <v-list-item @click="newFile = true">
            <v-list-item-icon>
              <v-icon color="primary">mdi-cloud-upload</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> {{ $t('upload.files') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- END Upload file -->

          <!-- START New folder -->
          <v-list-item @click="newFolder = true">
            <v-list-item-icon>
              <v-icon color="primary">mdi-folder</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> {{ $t('upload.newFolder') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <!-- END New folder -->
      </div>
    </section>
    <!-- End Menu -->

    <!-- Start Dialog new file -->
    <v-dialog max-width="400" v-model="newFile">
      <v-card>
        <v-card-title>
          <v-icon large left color="primary">mdi-cloud-upload</v-icon>
          <span class="title pr-5">{{ $t('upload.files') }}</span>

          <!-- START Progress file upload  -->
          <v-progress-circular
            indeterminate
            color="primary"
            v-if="progressSaveFile"
          ></v-progress-circular>
          <!-- END Progress file upload  -->
        </v-card-title>
        <v-card-text>
          <span style="color: #327BED" v-if="fileSuccessMessage">{{
            $t('upload.successMessage')
          }}</span>

          <v-file-input
            class="mt-3"
            v-model="file"
            accept=".xlsx,.xls,image/*,.doc,.docx,.ppt,.pptx,.txt,.pdf"
            :label="$t('upload.chooseFile')"
          ></v-file-input>
        </v-card-text>

        <v-card-actions class="pl-5 pb-3">
          <v-btn color="primary" width="120" @click="saveNewFile">{{ $t('button.save') }}</v-btn>
          <v-btn text width="120" @click="newFile = false" v-show="fileSuccessMessage === false">{{
            $t('button.cancel')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END Dialog new file -->

    <!-- Start Dialog new folder -->
    <v-dialog max-width="400" v-model="newFolder">
      <v-card>
        <v-card-title>
          <v-icon large left color="primary">mdi-folder</v-icon>
          <span class="title">{{ $t('upload.createFolder') }}</span>
        </v-card-title>
        <v-card-text class="pb-1">
          <v-text-field type="text" label="Folder name" />
        </v-card-text>
        <v-card-actions class="pl-5 pb-3">
          <v-btn color="primary" width="120" @click="newFolder = false">{{
            $t('button.create')
          }}</v-btn>
          <v-btn text width="120" @click="newFolder = false">{{ $t('button.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END Dialog new folder -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Upload',

  data: () => ({
    newFolder: false, // dialog
    newFile: false, // dialog

    file: '', // saveNewFile()

    userId: 0, // mounted from token
    organizationId: 0, // mounted from token
    organizationHash: '', // mounted from token

    progressSaveFile: false, // progess bar save file
    fileSuccessMessage: false, // v-alert message
  }),

  mounted() {
    // Take current user data and convert it from string to JSON
    const user = JSON.parse(sessionStorage.getItem('user'));

    // Take data from user
    this.userId = user.userId;
    this.organizationId = user.organizationId;
    this.organizationHash = user.organizationHash;
  },

  methods: {
    async saveNewFile() {
      this.progressSaveFile = true;
      // Create FormData with user avatar
      const formData = new FormData();
      formData.append('file', this.file);

      // Send data on Server
      await axios
        .post(process.env.VUE_APP_SERVER + '/file/', formData, {
          timeout: 50000,
          headers: {
            'Content-Type': 'multipart/form-data',
            userid: this.userId,
            organizationid: this.organizationId,
            organizationhash: this.organizationHash,
            authorization: $cookies.get('token'),
          },
        })
        .then((response) => {
          if (response.data.status === 'true') {
            this.progressSaveFile = false;
            this.fileSuccessMessage = true;

            // Timer for message
            let timer = this.saveNewFile.timer;
            if (timer) {
              clearTimeout(timer);
            }
            // Show message
            this.saveNewFile.timer = setTimeout(() => {
              this.fileSuccessMessage = false;
              this.newFile = false;

              // Refresh view
              this.$router.go(0);
            }, 3000);
          }
        })
        .catch((err) => {
          console.error('Upload avatar Error: ', err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/style/components/Upload';
</style>
