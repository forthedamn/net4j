import { IPlugin, IConfig as RootConfig } from 'net4j';

export interface PluginConfig extends RootConfig {
  actionName?: string;
  loadingText?: string | null;
  quiet?: boolean;
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

  beforeRequest(e: Error, config: PluginConfig) {
    if (config && (config.loadingText === null || config.quiet)) {
      return config;
    }
    // For more flexible , every request can reset laodingText.
    const loadingText = (config.actionName || '') +
      (config.loadingText || this.config.defaultLoadingText || 'loading');
    this.loadingClose = this.config.loading(loadingText);
    return config;
  }

  afterRequest(e, res) {
    if (typeof this.loadingClose === 'function') {
      this.loadingClose();
    }
    if (e) {
      return Promise.reject(e);
    }
    return res;
  }
}

export default LoadingPlugin;
