import Api from '@/controllers/Api';

export default {
  getAvatar(payload) {
    return Api().get('/avatar/', {
      params: {
        avatar: payload.avatar,
      },
    });
  },
};
