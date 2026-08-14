import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});
