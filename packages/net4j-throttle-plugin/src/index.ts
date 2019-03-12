import { IPlugin, IConfig as RootConfig } from 'net4j';

// default wait 1 second
const DEFAULT_WAIT = 1000;

const DEFAULT_CODE = 'THROTTLE_CODE';

interface IThrottleConfig {
  enable?: boolean;
  wait?: number;
}

interface IThrottleError extends Error {
  code?: string;
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

class ThrottlePlugin implements IPlugin {
  private config: IConfig;
  private reqList: IReq;
  private defaultWait: number;

  constructor(config: IConfig = {}) {
    this.config = Object.assign({ enable: true }, config);
    this.defaultWait = config.wait || DEFAULT_WAIT;
    this.reqList = {};
  }

  beforeRequest(e, config: ThrottleConfig) {
    if (!config.throttleConfig.enable) {
      return config;
    }
    const token = `${config.url}#${config.method}#${JSON.stringify(config.params)}#${JSON.stringify(config.data)}`;
    const request = this.reqList[token];
    if (request) {
      if (new Date().getTime() - request.startTime <= this.defaultWait) {
        const e: IThrottleError = new Error('operaion too quick');
        e.code = DEFAULT_CODE;
        throw e;
      }
    }
    this.reqList[token] = {
      startTime: new Date().getTime(),
    }
    return config;
  }

  afterRequest(e, response) {
    if (e && e.code === DEFAULT_CODE) {
      console.log('[net4j-throttle]Been throttled')
      return Promise.resolve(undefined);
    }
    return response;
  }

}

export default ThrottlePlugin;
