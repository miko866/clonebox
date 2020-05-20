import Api from '@/controllers/Api';

export default {
  getStorage(payload) {
    return Api().get(`/organization/storage/${payload.organizationHash}`);
  },
};
