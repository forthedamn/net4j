import axios from 'axios';
import { AxiosInstance } from 'axios';

import { IGetRoute, IConfig, INetConfig, IPlugin, METHOD, IDeleteRoute, IPostRoute, IPutRoute, ILib } from './index';
import { requestHandler } from './utils';
import { initPlugin, defaultPlugin } from './plugins';

class Net4j {
  private pluginsList: IPlugin[];
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
        this.lib = initPlugin(this.instance, plugin, this.lib);
      }
    }
  }

  private handleRestful(url: string | number, config?: IConfig) {
    if (!config || !config.restful) return url;
    // 替换 restful 字段
    const restRE = /\/:(\w+)/g;
    return String(url).replace(restRE, (_, key) => {
      const value = config.restful[key];
      return '/' + ((value !== undefined) ? encodeURIComponent(value) : (':' + key));
    });
  }

  private async request(method: METHOD, url: string | number, config?: IConfig, data?: any) {
    url = this.handleRestful(url, config);
    return await requestHandler(this.instance, method, url as string, config, data);
  }

  async get<URL extends keyof IGetRoute>(url: URL, config?: IConfig<IGetRoute[URL]['request']>): Promise<IGetRoute[URL]['response']> {
    return await this.request(METHOD.GET, url, config);
  }

  async post<URL extends keyof IPostRoute>(url: URL, postdata?: IPostRoute[URL]['request'], config?: IConfig<IPostRoute[URL]['request']>): Promise<IPostRoute[URL]['response']> {
    return await this.request(METHOD.POST, url, config, postdata);
  }

  async put<URL extends keyof IPutRoute>(url: URL, pudata?: IPutRoute[URL]['request'], config?: IConfig<IPutRoute[URL]['request']>): Promise<IPutRoute[URL]['response']> {
    return await this.request(METHOD.PUT, url, config, pudata);
  }

  async dlt<URL extends keyof IDeleteRoute>(url: URL, config?: IConfig<IDeleteRoute[URL]['request']>): Promise<IDeleteRoute[URL]['response']> {
    return await this.request(METHOD.DELETE, url, config);
  }
}

export default Net4j;
