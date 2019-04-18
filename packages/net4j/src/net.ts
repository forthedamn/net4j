import axios, { AxiosInstance } from 'axios';

import { requestHandler } from './utils';
import { initPlugin, defaultPlugin } from './plugins';
import { GetRoute, Config, NetConfig, Plugin, METHOD, DeleteRoute, PostRoute, PutRoute, Lib } from './index';

class Net4j {
  private pluginsList?: Plugin[];
  private lib: Lib;
  private instance: AxiosInstance;

  constructor(config: NetConfig = {}) {
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
        this.lib = initPlugin(this.instance, plugin, this.lib);
      }
    }
  }

  private handleRestful(url: string | number, config?: Config) {
    if (!config || !config.restful) return url;
    // 替换 restful 字段
    const restRE = /\/:(\w+)/g;
    return String(url).replace(restRE, (_, key) => {
      const value = config.restful![key];
      return '/' + ((value !== undefined) ? encodeURIComponent(value) : (':' + key));
    });
  }

  private async request<T>(method: METHOD, url: string | number, config?: Config, data?: T) {
    url = this.handleRestful(url, config);
    return await requestHandler(this.instance, method, url as string, config, data);
  }

  async get<URL extends keyof GetRoute>(url: URL, config?: Config<GetRoute[URL]['request']>): Promise<GetRoute[URL]['response']> {
    return await this.request(METHOD.GET, url, config);
  }

  async post<URL extends keyof PostRoute>(url: URL, postdata?: PostRoute[URL]['request'], config?: Config<PostRoute[URL]['request']>): Promise<PostRoute[URL]['response']> {
    return await this.request(METHOD.POST, url, config, postdata);
  }

  async put<URL extends keyof PutRoute>(url: URL, pudata?: PutRoute[URL]['request'], config?: Config<PutRoute[URL]['request']>): Promise<PutRoute[URL]['response']> {
    return await this.request(METHOD.PUT, url, config, pudata);
  }

  async dlt<URL extends keyof DeleteRoute>(url: URL, config?: Config<DeleteRoute[URL]['request']>): Promise<DeleteRoute[URL]['response']> {
    return await this.request(METHOD.DELETE, url, config);
  }
}

export default Net4j;
