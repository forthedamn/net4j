import axios from 'axios';
import { IPlugin, ILib } from './index';

export const initPlugin = (plugin: IPlugin, lib: ILib) => {
  if (plugin.beforeRequest) {
    axios.interceptors.request.use((config) => {
      return plugin.beforeRequest(undefined, config, lib);
    },(e) => {
      return plugin.beforeRequest(e, undefined, lib);
    })
  }

  if (plugin.afterRequest) {
    axios.interceptors.response.use((response) => {
      return plugin.afterRequest(undefined, response, lib);
    }, (e) => {
      return plugin.afterRequest(e, undefined, lib);
    })
  }

  if (plugin.applyLib) {
    return Object.assign({}, lib, plugin.applyLib(lib));
  }
  return lib;
}
