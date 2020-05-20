import axios from 'axios';

// Connection with server
export default () => {
  return axios.create({
    baseURL: process.env.VUE_APP_SERVER,
    timeout: 6000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
