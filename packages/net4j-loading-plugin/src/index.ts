import { IPlugin, IConfig as NetConfig } from 'net4j';

declare module 'net4j' {
  interface IConfig {
    actionName?: string;
    loadingText?: string;
  }
}

interface IConfig<T = any, K = any> {
  loading: (text?: string) => () => void;
  loadingText?: string;
}

class LoadingPlugin<T, K> implements IPlugin{
  private config: IConfig<T, K>;
  private loadingClose: () => void;

  constructor(config: IConfig<T>) {
    this.config = config;
    this.loadingClose = () => {};
  }

  beforeRequest(e, config: NetConfig){
    if (e) {
      return Promise.reject(e);
    }
    // For more flexible , every request can reset laodingText.
    const loadingText = config.actionName + (config.loadingText || this.config.loadingText || 'loading');
    this.loadingClose = this.config.loading(loadingText);
    return config;
  }

  afterRequest(e, res) {
    this.loadingClose();
    if (e) {
      return Promise.reject(e);
    }
    return res;
  }
}

export default LoadingPlugin;
