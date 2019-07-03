import { IPlugin, IConfig as RootConfig } from 'net4j';

export interface PluginConfig extends RootConfig {
  actionName?: string;
  successText?: string | null;
}
interface Config {
  tipsComponent: (text?: string) => void;
  defaultSuccessText?: string;
  isShow: (res: any) => boolean;
  quiet?: boolean;
}

class SuccessPlugin implements IPlugin{
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  beforeRequest(e: Error, config: PluginConfig){
    return config;
  }

  afterRequest(e: Error, res) {
    if (e) {
      return Promise.reject(e);
    }
    if (res && (res.config.quiet === true || res.config.successText === null)) {
      return res;
    }
    if (res && res.config && this.config.isShow(res)) {
      setTimeout(()=> {
        this.config.tipsComponent((res.config.actionName || '') +
        (res.config.successText || this.config.defaultSuccessText || 'success'))
      });
    }
    return res;
  }
}

export default SuccessPlugin;
