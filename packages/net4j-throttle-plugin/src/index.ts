import { IPlugin, IConfig as RootConfig } from 'net4j';

// default wait 1 second
const DEFAULT_WAIT = 1000;

interface IThrottleConfig {
  enable?: boolean;
  wait?: number;
}

interface IReq {
  [token: string]: {
    startTime: number;
  }
}

export interface ThrottleConfig extends RootConfig {
  throttleConfig?: IThrottleConfig;
  cancelRequst?: boolean;
}

interface IConfig extends IThrottleConfig {}

class ThrottlePlugin implements IPlugin{
  private config: IConfig;
  private reqList: IReq;
  private defaultWait: number;

  constructor(config: IConfig = {}) {
    this.config = Object.assign({ enable: true }, config);
    this.defaultWait = config.wait || DEFAULT_WAIT;
    this.reqList = {};
  }

  beforeRequest(e, config: ThrottleConfig) {
    config.cancelRequst = false;
    if (!config.throttleConfig.enable || !this.config.enable) {
      return config;
    }
    const token = config.url + config.method + config.params + JSON.stringify(config.data);
    const request = this.reqList[token];
    if (request) {
      if (new Date().getTime() - request.startTime <= this.defaultWait) {
        config.cancelRequst = true;
      } else {
        delete this.reqList[token];
      }
      return config;
    }
    this.reqList[token] = {
      startTime: new Date().getTime(),
    }
    return config;
  }

}

export default ThrottlePlugin;
