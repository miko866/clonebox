import Api from '@/controllers/Api';

export default {
  createOrganization(organizationData) {
    return Api().post('/organization', organizationData);
  },
};
