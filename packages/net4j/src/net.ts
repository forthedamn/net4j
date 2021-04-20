import axios, { AxiosInstance } from 'axios';

import { requestHandler } from './utils';
import { initPlugin, defaultPlugin } from './plugins';
import { IGetRoute, IConfig, INetConfig, IPlugin, METHOD, IDeleteRoute,  IPostRoute,  IPutRoute, ILib } from './index';

class Net4j<C = {}> {
  private pluginsList?: IPlugin[];
  private lib: ILib;
  private instance: AxiosInstance;

  constructor(config: INetConfig = {}) {
    this.lib = config.lib || {};
    this.instance = axios.create(
      config.globalAxiosConfig || {}
    );
    const pluginsList = defaultPlugin.concat(config.plugins || []);
    if (pluginsList && pluginsList.length > 0) {
      this.pluginsList = pluginsList;
    }
    this.initPlugins();
  }

  private initPlugins() {
    if (this.pluginsList) {
      for (const plugin of this.pluginsList) {
        this.lib = initPlugin(this.instance, plugin, this.lib).lib;
      }
    }
  }

  // 在网络库实例化后，注册新的插件
  addPlugins(plugins: IPlugin[]) {
    // 可以注释掉插件
    const rejectList: Array<() => void> = []
    for (const plugin of plugins) {
      const res = initPlugin(this.instance, plugin, this.lib);
      rejectList.push(() => {
        if (res.reject.request) {
          this.instance.interceptors.request.eject(res.reject.request);
        }
        if (res.reject.response) {
          this.instance.interceptors.response.eject(res.reject.reponse);
        }
      });
      if (res.lib) {
        this.lib = Object.assign(this.lib, res.lib);
      }
    }
    return rejectList;
  }

  private handleRestful(url: string, config?: IConfig) {
    if (!config || !config.restful) return url;
    // 替换 restful 字段
    const restRE = /\/:(\w+)/g;
    return url.replace(restRE, (_, key) => {
      const value = config.restful![key];
      return '/' + ((value !== undefined) ? encodeURIComponent(value) : (':' + key));
    });
  }

  private async request<T>(method: METHOD, url: string | number, config?: IConfig & T, data?: T) {
    url = this.handleRestful(String(url), config);
    return requestHandler(this.instance, method, url, config, data);
  }

  async get<URL extends keyof IGetRoute>(url: URL, config?: IConfig<IGetRoute[URL]['request']> & C): Promise<IGetRoute[URL]['response']> {
    return await this.request(METHOD.GET, url, config);
  }

  async post<URL extends keyof  IPostRoute>(url: URL, postdata?:  IPostRoute[URL]['request'], config?: IConfig< IPostRoute[URL]['request']> & C): Promise< IPostRoute[URL]['response']> {
    return await this.request(METHOD.POST, url, config, postdata);
  }

  async put<URL extends keyof  IPutRoute>(url: URL, pudata?:  IPutRoute[URL]['request'], config?: IConfig< IPutRoute[URL]['request']> & C): Promise< IPutRoute[URL]['response']> {
    return await this.request(METHOD.PUT, url, config, pudata);
  }

  async dlt<URL extends keyof IDeleteRoute>(url: URL, config?: IConfig<IDeleteRoute[URL]['request']> & C): Promise<IDeleteRoute[URL]['response']> {
    return await this.request(METHOD.DELETE, url, config);
  }
}

export default Net4j;
