import { AxiosInstance } from 'axios';
import NetLog from 'net4j-log-plugin';

import { Plugin, Lib } from './index';

export const initPlugin = (instance: AxiosInstance, plugin: Plugin, lib: Lib) => {
  if (plugin.beforeRequest) {
    instance.interceptors.request.use((config) => {
      return plugin.beforeRequest!(undefined, config, lib);
    },(e) => {
      return plugin.beforeRequest!(e, undefined, lib);
    })
  }

  if (plugin.afterRequest) {
    instance.interceptors.response.use((response) => {
      return plugin.afterRequest!(undefined, response, lib);
    }, (e) => {
      return plugin.afterRequest!(e, undefined, lib);
    })
  }

  if (plugin.applyLib) {
    return Object.assign({}, lib, plugin.applyLib(lib));
  }
  return lib;
}

// 内置插件
export const defaultPlugin: Plugin[] = [
  new NetLog({
    log: {
      info: (...args) => {
        console.log('[net4j]', ...args)
      },
      error: console.error,
    }
  }),
]
