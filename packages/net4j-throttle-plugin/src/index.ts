import { IPlugin, IConfig as RootConfig } from 'net4j';
import axios, { AxiosResponse } from 'axios';

const CancelToken = axios.CancelToken;
const isCancel = axios.isCancel;

// default wait 1 second
const DEFAULT_WAIT = 1000;

// GC when reqList keys bigger than threshold
const GC_THRESHOLD = 20;

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

export interface PluginConfig extends RootConfig {
  throttleConfig?: IThrottleConfig;
}

interface Config extends IThrottleConfig {}

class ThrottlePlugin implements IPlugin {
  private reqList: IReq;
  private defaultWait: number;

  constructor(config: Config = {}) {
    this.defaultWait = config.wait || DEFAULT_WAIT;
    this.reqList = {};
  }

  beforeRequest(e: Error, config: PluginConfig) {
    if (config && config.throttleConfig && config.throttleConfig.enable === false) {
      return config;
    }
    const token = `${config.url}#${config.method}#${JSON.stringify(config.params)}#${JSON.stringify(config.data)}#${(location || {href: ''}).href}`;
    const request = this.reqList[token];
    if (request) {
      if (new Date().getTime() - request.startTime <= this.defaultWait) {
        return {
          ...config,
          cancelToken: new CancelToken((cancel) => {
              cancel('[throttle]Too Many Requests');
          })
      }
      }
    } else {
      this.GC();
    }
    this.reqList[token] = {
      startTime: new Date().getTime(),
    }
    return config;
  }

  afterRequest(e?: Error, response?: AxiosResponse) {
    if (isCancel(e)) {
      console.log('[net4j-throttle]Been throttled');
      return Promise.resolve({
        status: 429,
        statusText: 'Too Many Requests',
      });
    } else if (e) {
      return Promise.reject(e);
    }
    return response;
  }

  // GC for reqList
  private GC() {
    if (Object.keys(this.reqList).length > GC_THRESHOLD) {
      this.reqList = {}
    }
    return;
  }

}

export default ThrottlePlugin;
