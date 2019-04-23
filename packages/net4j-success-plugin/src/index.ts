import { IPlugin, IConfig as RootConfig } from 'net4j';
import { AxiosResponse } from 'axios';

export interface PluginConfig extends RootConfig {
  actionName?: string;
  defaultSuccessText?: string;
}
interface IConfig {
  tipsComponent: (text?: string) => void;
  defaultSuccessText?: string;
  isShow: (res: any) => boolean;
}

class SuccessPlugin implements IPlugin{
  private config: IConfig;
  private successText: string;

  constructor(config: IConfig) {
    this.config = config;
  }

  beforeRequest(e: Error, config: PluginConfig){
    // For more flexible , every request can reset successText.
    this.successText = (config.actionName || '') +
      (config.defaultSuccessText || this.config.defaultSuccessText || 'success');
    return config;
  }

  afterRequest(e: Error, res) {
    if (e) {
      return Promise.reject(e);
    }
    if (this.config.isShow(res)) {
      setTimeout(()=> {
        this.config.tipsComponent(this.successText)
      });
    }
    return res;
  }
}

export default SuccessPlugin;
