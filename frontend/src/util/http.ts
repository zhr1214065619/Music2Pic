/**
 * this file is used to handle request and response.
 */

import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type Response = {
  success: boolean;
  msg: string;
  status: number;
  data: { [key: string]: any };
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 100000,
});

instance.interceptors.response.use(
  function (response) {
    if (response.status == 200) {
      return response.data;
    }

    if (response.data.status) {
      handleStatus(response.data.status);
    } else {
      handleStatus(response.status);
    }

    return Promise.reject(response.data.msg);
  },
  function (error) {
    handleStatus(error.response.status);
    return Promise.reject(error);
  }
);

function handleStatus(status: number) {
  console.log(status);
}

export interface Data {
  [index: string]: unknown;
}

interface Http {
  get: (
    url: string,
    data?: Data | FormData,
    config?: AxiosRequestConfig
  ) => Promise<Response>;
  post: (
    url: string,
    data?: Data | FormData,
    config?: AxiosRequestConfig
  ) => Promise<Response>;
  put: (
    url: string,
    data?: Data | FormData,
    config?: AxiosRequestConfig
  ) => Promise<Response>;
  patch: (
    url: string,
    data?: Data | FormData,
    config?: AxiosRequestConfig
  ) => Promise<Response>;
  delete: (
    url: string,
    data?: Data | FormData,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse>;
}

const http: Http = {
  get(url, data, config) {
    return instance.get(url, {
      params: data,
      ...config,
    } as AxiosRequestConfig);
  },
  post(url, data, config) {
    return instance.post(url, data, config as AxiosRequestConfig);
  },
  put(url, data, config) {
    return instance.put(url, data, config as AxiosRequestConfig);
  },
  patch(url, data, config) {
    return instance.patch(url, data, config as AxiosRequestConfig);
  },
  delete(url, data, config) {
    return instance.delete(url, {
      data,
      ...config,
    } as AxiosRequestConfig);
  },
} as Http;

export default http;
