import { IPlugin, IConfig as NetConfig } from 'net4j';

declare module 'net4j' {
  interface IConfig {
    actionName?: string;
    successText?: string;
  }
}

interface IConfig {
  toast: (text?: string) => () => void;
  successText?: string;
}

class LoadingPlugin implements IPlugin{
  private config: IConfig;
  private successText: string;

  constructor(config: IConfig) {
    this.config = config;
  }

  beforeRequest(e, config: NetConfig){
    if (e) {
      return Promise.reject(e);
    }
    // For more flexible , every request can reset successText.
    this.successText = config.actionName + (config.successText || this.config.successText || 'success');
    return config;
  }

  afterRequest(e, res) {
    if (e) {
      return Promise.reject(e);
    }
    setTimeout(this.config.toast(this.successText))
    return res;
  }
}

export default LoadingPlugin;
