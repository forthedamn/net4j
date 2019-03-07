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
