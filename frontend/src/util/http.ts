import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8080/api';

const instance = axios.create({
    baseURL: API_URL,
    timeout: 100000,
});

export interface Data {
    [index: string]: unknown;
}

interface Http {
    get: (
      url: string,
      data?: Data,
      config?: AxiosRequestConfig
    ) => Promise<AxiosResponse>;
    post: (
      url: string,
      data?: Data,
      config?: AxiosRequestConfig
    ) => Promise<AxiosResponse>;
    put: (
      url: string,
      data?: Data,
      config?: AxiosRequestConfig
    ) => Promise<AxiosResponse>;
    delete: (
      url: string,
      data?: Data,
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
  delete(url, data, config) {
    return instance.delete(url, {
      data,
      ...config,
    }  as AxiosRequestConfig);
  }
};

export default http;