import axios from 'axios';
import qs from 'qs';

const RestClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
  transformRequest: [(data) => qs.stringify(data)],
  headers: {
    Accept: 'application/x-www-form-urlencoded',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

export default RestClient;
