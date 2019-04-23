import { Plugin, Config as RootConfig } from 'net4j';

export interface PluginConfig extends RootConfig {
  actionName?: string;
  defaultLoadingText?: string;
}

interface Config {
  loading: (text?: string) => () => void;
  defaultLoadingText?: string;
}

class LoadingPlugin implements Plugin{
  private config: Config;
  private loadingClose: () => void;

  constructor(config: Config) {
    this.config = config;
    this.loadingClose = () => {};
  }

  beforeRequest(e: Error, config: PluginConfig) {
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
