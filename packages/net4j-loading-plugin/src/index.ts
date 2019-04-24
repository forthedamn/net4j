import { IPlugin, IConfig as RootConfig } from 'net4j';

export interface IPluginConfig extends RootConfig {
  actionName?: string;
  defaultLoadingText?: string;
}

interface Config {
  loading: (text?: string) => () => void;
  defaultLoadingText?: string;
}

class LoadingPlugin implements IPlugin{
  private config: Config;
  private loadingClose: () => void;

  constructor(config: Config) {
    this.config = config;
    this.loadingClose = () => {};
  }

  beforeRequest(e: Error, config: IPluginConfig) {
    // For more flexible , every request can reset laodingText.
    const loadingText = (config.actionName || '') +
      (config.defaultLoadingText || this.config.defaultLoadingText || 'loading');
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
