import axios from 'axios';
import { API_URL } from '../constants';

export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  // timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
