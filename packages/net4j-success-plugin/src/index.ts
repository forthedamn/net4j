import { IPlugin, IConfig as RootConfig } from 'net4j';

export interface NetConfig extends RootConfig {
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

  beforeRequest(e, config: NetConfig){
    if (e) {
      return;
    }
    // For more flexible , every request can reset successText.
    this.successText = (config.actionName || '') +
      (config.defaultSuccessText || this.config.defaultSuccessText || 'success');
    return config;
  }

  afterRequest(e, res) {
    if (e) {
      return Promise.reject(e);
    }
    setTimeout(()=> {
      this.config.tipsComponent(this.successText)
    });
    return res;
  }
}

export default SuccessPlugin;
