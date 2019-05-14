import { IPlugin, IConfig as RootConfig } from 'net4j';
import axios, { AxiosResponse } from 'axios';
import * as qs from 'qs';

const CancelToken = axios.CancelToken;
const isCancel = axios.isCancel;

// default wait 0.5 second
const DEFAULT_WAIT = 500;

// GC when reqList keys bigger than threshold
const GC_THRESHOLD = 20;

interface IThrottleConfig {
  enable?: boolean;
  wait?: number;
}

interface IThrottleError extends Error {
  code?: number;
  token: string;
}

interface IReq {
  [token: string]: {
    startTime: number;
    result?: any;
    isThrottled?: boolean;
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
        this.reqList[token].isThrottled = true;
        return {
          ...config,
          cancelToken: new CancelToken((cancel) => {
              cancel(`token=${token}&method=${config.method}&url=${config.url}`);
          })
      }
      }
    } else {
      this.GC();
    }
    this.reqList[token] = Object.assign({}, this.reqList[token], {
      startTime: new Date().getTime(),
    });
    return config;
  }

  afterRequest(e?: IThrottleError, response?: AxiosResponse) {

    if (isCancel(e)) {
      const message = qs.parse(e.message);
      console.warn(`---------------------------------------------`);
      console.warn(`[throttle]method:${message.method},url:${message.url}`);
      console.warn(`---------------------------------------------`);
      if (window) {
        if (this.reqList[message.token] && this.reqList[message.token].result) return this.reqList[message.token].result;
        return new Promise((resolve, reject) => {
          const listener = (e) => {
            if (e && e.detail) {
              return resolve(e.detail)
            } else {
              return reject({message: '截流数据无返回'});
            }
          };
          window.addEventListener(message.token, listener, { once: true });
        });
      }
    } else if (e) {
      return Promise.reject(e);
    }

    // 没有被拦截的请求
    // 构造 token
    let token: string = '';
    if (response && response.config) {
      const config = response.config;
      token = `${config.url}#${config.method}#${JSON.stringify(config.params)}#${JSON.stringify(config.data)}#${(location || {href: ''}).href}`;
    }
    if (token && response.data && window) {
      // 更新 result 缓存
      this.reqList[token] = Object.assign({}, this.reqList[token], {
        result: response
      });
      // 自定义事件分发
      const event = new CustomEvent(token, { detail: response });
      const pendingTime = new Date().getTime() - (this.reqList[token] || {startTime: new Date().getTime()}).startTime;
      window.dispatchEvent(event);
      const reset = () => {
        // DEFAULT_WAIT 时间后还原 result 和截流状态
        if (this.reqList[token]) {
          this.reqList[token].result = null;
          this.reqList[token].isThrottled = false;
        }
      }
      // 如果超过一个截流循环，可以直接重置
      if (pendingTime > DEFAULT_WAIT) {
        reset();
      } else {
        // 如果不到一个截流循环，需要等待到一个截流循环再重置
        setTimeout(() => {
          reset();
        }, DEFAULT_WAIT- pendingTime)
      }
    }
    return response;
  }

  // GC for reqList
  private GC() {
    if (Object.keys(this.reqList).length > GC_THRESHOLD) {
      Object.keys(this.reqList).forEach(key => {
        // 只清除在 list 中没有在截流状态中的请求
        if (this.reqList[key] && !this.reqList[key].isThrottled) {
          delete this.reqList[key];
        }
      });
    }
    return;
  }

}

export default ThrottlePlugin;
