import { METHOD, IConfig, IPlugin, LifeTimeEnum } from './index';
import { AxiosInstance } from 'axios';

const DEFAULT_TIMEOUT = 10000;

// 统一处理 ajax 结果
export const requestHandler = async (instance: AxiosInstance, action: METHOD, url: string, config: IConfig, reqdata: any = {}) => {
  config = config || {};
  config.timeout = (config && config.timeout) || DEFAULT_TIMEOUT;
  let ret;
  switch(action) {
    case METHOD.GET:
      ret = await instance.get(url, config);
      break;
    case METHOD.POST:
      ret = await instance.post(url, reqdata, config);
      break;
    case METHOD.PUT:
      ret = await instance.put(url, reqdata, config);
      break;
    case METHOD.DELETE:
      ret = await instance.delete(url, config);
      break;
    default:
      break;
  };
  return ret;
}

const pluginWalker = (lifeTime: LifeTimeEnum, pluginsList: IPlugin) => {
}
