import { IPlugin, IConfig as RootConfig } from 'net4j';

export interface PluginConfig extends RootConfig {
  actionName?: string;
  defaultSuccessText?: string;
}
interface IConfig {
  tipsComponent: (text?: string) => void;
  defaultSuccessText?: string;
}

class SuccessPlugin implements IPlugin{
  private config: IConfig;
  private successText: string;

  constructor(config: IConfig) {
    this.config = config;
  }

  beforeRequest(e, config: PluginConfig){
    // For more flexible , every request can reset successText.
    this.successText = (config.actionName || '') +
      (config.defaultSuccessText || this.config.defaultSuccessText || 'success');
    return config;
  }

  afterRequest(e, res) {
    if (e) {
      return Promise.reject(e);
    }
    if (res && res.data && res.data.code === 0) {
      setTimeout(()=> {
        this.config.tipsComponent(this.successText)
      });
    }
    return res;
  }
}

export default SuccessPlugin;
