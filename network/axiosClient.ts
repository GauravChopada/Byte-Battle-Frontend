import axios from 'axios';

import { clearLocalStorage, isTokenExpired } from '../utils/Helpers';
import refreshToken from './refreshToken';

const baseURL = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1`;

const axiosClient = () => {
  const axiosPrivate = axios.create({ baseURL });

  // intercept request and add access token to header
  axiosPrivate.interceptors.request.use(
    async (config) => {
      if (config.withCredentials) {
        let accessToken = localStorage.getItem('accessToken') ?? '';
        const isExpired = isTokenExpired(accessToken);

        // if expired, refresh token using refresh token endpoint
        if (isExpired) {
          try {
            accessToken = await refreshToken()
          } catch (error) {
            // if refresh token fails, redirect to login page
            clearLocalStorage()
            console.error(error)
            window.location.href = '/login';
          }
        } 
        config.headers.Authorization = accessToken;
      }
      config.withCredentials = false;

      // set content type to json
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  // intercept response and redirect to login page if 401
  axiosPrivate.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error.response.status === 401 && !error.config.url.includes('auth')) {
      clearLocalStorage()
      window.location.href = '/login';
    }
    return Promise.reject(error);
  });

  return axiosPrivate;
};

export default axiosClient;
