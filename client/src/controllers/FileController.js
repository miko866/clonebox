import Api from '@/controllers/Api';

export default {
  getAllFilesByUser(payload) {
    return Api().get(`/file/user/${payload.userId}`);
  },
  getAllFilesByOrganization(payload) {
    return Api().get(`/file/organization/${payload.organizationId}`);
  },

  downloadFile(payload) {
    return Api().get('/file/download', {
      params: {
        path: payload.path,
      },
    });
  },

  deleteFile(payload) {
    return Api().delete('/file', {
      params: {
        file: payload.file,
      },
    });
  },
};
