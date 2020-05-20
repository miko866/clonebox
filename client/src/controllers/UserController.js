import Api from '@/controllers/Api';

export default {
  verifyUser(token) {
    return Api().post('/user/verifiedToken', token);
  },
};
