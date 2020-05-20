import Api from '@/controllers/Api';

export default {
  createUser(userData) {
    return Api().post('/user', userData);
  },

  login(credentials) {
    return Api().post('/user/login', credentials);
  },
};
