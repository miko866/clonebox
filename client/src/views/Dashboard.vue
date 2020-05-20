<template>
  <v-row class="dashboard ma-0" no-gutters>
    <v-col class="col-3 pa-0 userCol">
      <!-- START User component -->
      <v-col class="col-12 pa-0 userCol__avatar">
        <User />
      </v-col>
      <!-- END User component -->

      <!-- START FileSelection component -->
      <v-col class="col-12 userCol__selection">
        <FileSelection v-on:choosedType="onTypeClick" />
      </v-col>
      <!-- END FileSelection component -->
    </v-col>

    <v-col class="col-9 pt-2 pl-4">
      <v-row class="ma-0 fill-height" no-gutters>
        <!-- START Dashboard title -->
        <v-col class="dashboard__title col-12">
          <h1>{{ $t('dashboard.organization') }} {{ organizationName }}</h1>
        </v-col>
        <!-- END Dashboard title -->

        <v-row class="ma-0" style="height: 100%;">
          <!-- START Table component -->
          <v-col class="col-9 pt-0">
            <Table :showDataFrom="type" />
          </v-col>
          <!-- END Table component -->

          <!-- START Upload component -->
          <v-col class="col-3 pa-0 ">
            <Upload />
          </v-col>
          <!-- END Upload component -->
        </v-row>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
// Imports custom components
import Table from '../components/Table';
import User from '../components/User';
import Upload from '../components/Upload';
import FileSelection from '../components/FileSelection';

export default {
  name: 'Dashboard',

  components: {
    Table,
    User,
    Upload,
    FileSelection,
  },

  data: () => ({
    organizationName: '', // mounted

    type: '', // $emit from FileSelection component
  }),

  mounted() {
    // Take current user data and convert it from string to JSON
    const user = JSON.parse(sessionStorage.getItem('user'));
    this.organizationName = user.organizationName;
  },

  methods: {
    onTypeClick(value) {
      this.type = value;
    },
  },
};
</script>

<style lang="scss" scoped>
@import './src/assets/style/view/Dashboard';
</style>
