import { IGetRoute, IConfig, IPlugin, METHOD, IDeleteRoute, IPostRoute, IPutRoute, ILib } from './index';
import { requestHandler } from './utils';
import { initPlugin, defaultPlugin } from './plugins';

class Net4j {
  netConfig: IConfig;
  private pluginsList: IPlugin[];
  private lib: ILib;

  constructor(config:IConfig = {}) {
    this.netConfig = config;
    this.lib = config.lib;
    const pluginsList = defaultPlugin.concat(config.plugins || []);
    if (pluginsList && pluginsList.length > 0) {
      this.pluginsList = pluginsList;
    }
    this.initPlugins();
  }

  private initPlugins() {
    if (this.pluginsList) {
      for (const plugin of this.pluginsList) {
        this.lib = initPlugin(plugin, this.lib);
      }
    }
  }

  private async request(method: METHOD, url: string | number, config?: IConfig, data?: any) {
    return await requestHandler(method, url as string, config, data);
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
