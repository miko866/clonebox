<template>
  <section class="table">
    <!-- START Search -->
    <div class="table__search">
      <div class="table__search--input">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('table.search')"
          single-line
          hide-details
        ></v-text-field>
      </div>
    </div>
    <!-- END Search -->

    <!-- Start Tada table -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="files"
        :search="search"
        :no-data-text="noData"
        :no-results-text="noResult"
        :footer-props="{
          itemsPerPageText: itemsPerPage,
        }"
      >
        <!-- START Action icons -->
        <template v-slot:item.actions="{ item }">
          <div style="width: 6em;">
            <v-icon class="mr-2 hover-download" @click="downloadFile(item.path)">
              mdi-cloud-download
            </v-icon>
            <v-icon
              class="ml-4 hover-delete"
              @click="deleteFile(item)"
              v-show="item.userId === userId"
            >
              mdi-delete-forever
            </v-icon>
          </div>
        </template>
        <!-- END Action icons -->
      </v-data-table>
    </v-card>
    <!-- End Tada table -->

    <!-- Start Delete dialog -->
    <v-dialog max-width="450" v-model="confirmDelete">
      <v-card>
        <v-card-title>
          <span class="title"> {{ $t('table.deleteText') }}</span>
        </v-card-title>

        <!-- START Buttons -->
        <v-card-actions class="pl-5 pb-3 justify-center">
          <v-btn color="primary" width="120" @click="confirmDeleteFile">
            {{ $t('button.delete') }}</v-btn
          >
          <v-btn text width="120" @click="confirmDelete = false"> {{ $t('button.cancel') }}</v-btn>
        </v-card-actions>
        <!-- END Buttons -->
      </v-card>
    </v-dialog>
    <!-- END Delete dialog -->
  </section>
</template>

<script>
import FileController from '@/controllers/FileController';

export default {
  name: 'Table',

  props: {
    showDataFrom: String,
  },

  data: () => ({
    search: '', // data teble

    confirmDelete: false, // delete dialog

    files: [], // mounted all user files from DB
    myFiles: [], // mounted all organization files from DB
    allFiles: [], // mounted all organization files from DB

    userId: 0, // mounted from token
    organizationId: 0, // mounted from token

    deleteItem: '', // deleteFile()
  }),

  async mounted() {
    // Take current user data and convert it from string to JSON
    const user = JSON.parse(sessionStorage.getItem('user'));

    // Load all file for current user from DB
    this.userId = user.userId;
    await FileController.getAllFilesByUser({
      userId: this.userId,
    })
      .then((response) => {
        this.myFiles = response.data.message;
        this.files = this.myFiles;
      })
      .catch((err) => {
        console.error('Error myFiles: ', err);
      });

    // Load all file for current organization from DB
    this.organizationId = user.organizationId;
    await FileController.getAllFilesByOrganization({
      organizationId: this.organizationId,
    })
      .then((response) => {
        this.allFiles = response.data.message;
      })
      .catch((err) => {
        console.error('Error allFiles: ', err);
      });
  },

  computed: {
    // For data table text
    noData() {
      return this.$t('table.noData');
    },
    // For data table text
    noResult() {
      return this.$t('table.noResult');
    },
    // For data table text
    itemsPerPage() {
      return this.$t('table.itemsPerPage');
    },
    // For data table text
    headers() {
      return [
        { text: this.$t('table.name'), value: 'name' },
        { text: this.$t('table.modified'), value: 'modified' },
        { text: this.$t('table.type'), value: 'type' },
        { text: this.$t('table.size'), value: 'size' },
        { text: this.$t('table.author'), value: 'author' },
        { text: this.$t('table.actions'), value: 'actions' },
      ];
    },
  },

  methods: {
    // Open dialog and take data about file
    deleteFile(item) {
      this.deleteItem = item;
      this.confirmDelete = true;
    },

    async confirmDeleteFile() {
      await FileController.deleteFile({
        file: this.deleteItem,
      })
        .then((response) => {
          this.confirmDelete = false;
          if (response.data.status === 'true') {
            // Refresh view
            this.$router.go(0);
          }
        })
        .catch((err) => {
          console.error('Error: ', err);
        });
    },

    // TODO doesn't works, ask Schmitz
    fileDownload(response) {
      const fileName = response.headers['content-disposition'].split(';')[1].split('=')[1];
      const contentType = response.headers['content-type'];

      const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
    },

    async downloadFile(path) {
      console.log('Halooo : ', path);

      await FileController.downloadFile(
        {
          path: path,
        },
        { responseType: 'arraybuffer' },
      )
        .then((response) => {
          console.log('Response download: ', response);

          this.fileDownload(response);
        })
        .catch((err) => {
          console.error('Error: ', err);
        });
    },
  },
  watch: {
    // Switch which data would be shown
    showDataFrom: function(val) {
      if (val === 'myFiles') {
        this.files = this.myFiles;
      } else {
        this.files = this.allFiles;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/assets/style/components/Table';
</style>
