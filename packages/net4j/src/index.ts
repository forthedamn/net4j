import { requestHandler } from './utils';
import { beforeRequest, afterRequest } from './plugins';

import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IPlugin {
  beforeRequest?(e?: Error, config?: AxiosRequestConfig): IConfig | Promise<IConfig>;
  request?<T = any>(method: METHOD, url:string, config?: IConfig, data?: any): Promise<T>;
  afterRequest?<T = any>(e?: Error, response?: T): T | Promise<AxiosResponse<Error>>;
}

export interface IGetRoute {}

export interface IPostRoute {}

export interface IPutRoute {}

export interface IConfig extends AxiosRequestConfig {
  plugins?: Array<IPlugin>,
  timeout?: number;
}

export interface IDeleteRoute {}

export enum METHOD {
  GET,
  POST,
  PUT,
  DELETE,
}

export enum LifeTimeEnum {
  beforeRequest = 'beforeRequest',
  afterRequest = 'afterRequest',
  request = 'request',
}

class Net4j {
  netConfig: IConfig;
  private pluginsList: IPlugin[];

  constructor(config = {plugins: []}) {
    this.netConfig = config;
    const pluginsList = config.plugins;
    if (pluginsList && pluginsList.length > 0) {
      this.pluginsList = pluginsList;
    }
    this.initPlugins();
  }

  private initPlugins() {
    if (this.pluginsList) {
      for (const plugin of this.pluginsList) {
        beforeRequest(plugin);
        afterRequest(plugin);
      }
    }
  }

  private async request(method: METHOD, url: string, config?: IConfig, data?: any) {
    return await requestHandler(method, url, config, data);
  }

  async get<URL extends keyof IGetRoute>(url: URL, config?: IConfig): Promise<IGetRoute[URL]> {
    return await this.request(METHOD.GET, url, config);
  }

  async post<URL extends keyof IPostRoute>(url: URL, postdata?: any, config?: IConfig): Promise<IPostRoute[URL]> {
    return await this.request(METHOD.POST, url, config, postdata);
  }

  async put<URL extends keyof IPutRoute>(url: URL, pudata?: any, config?: IConfig): Promise<IPutRoute[URL]> {
    return await this.request(METHOD.PUT, url, config, pudata);
  }

  async dlt<URL extends keyof IDeleteRoute>(url: URL, config?: IConfig): Promise<IDeleteRoute[URL]> {
    return await this.request(METHOD.DELETE, url, config);
  }
}

export default Net4j;
