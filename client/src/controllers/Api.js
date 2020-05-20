import axios from 'axios';
import { getCookie } from '../helpers';

// Take token from cookie
const token = getCookie('token');

// Connection with server
export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_SERVER,
    timeout: 6000,
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    },
  });
};
