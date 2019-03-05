import axios from 'axios';
import { IPlugin } from './index';

export const beforeRequest = (plugin: IPlugin) => {
  if (plugin.beforeRequest) {
    axios.interceptors.request.use((config) => {
      return plugin.beforeRequest(undefined, config);
    },(e) => {
      return plugin.beforeRequest(e);
    })
  }
};

export const afterRequest = (plugin: IPlugin) => {
  if (plugin.afterRequest) {
    axios.interceptors.response.use((response) => {
      return plugin.afterRequest(undefined, response);
    }, (e) => {
      return plugin.afterRequest(e);
    })
  }
}
