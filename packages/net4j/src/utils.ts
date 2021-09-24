import { AxiosInstance } from 'axios';
import { METHOD, IConfig } from './index';

interface Header {
  [key: string]: string | number;
}

const header2LowerCase = (object?: Header) => {
  if (!object) return {};
  const clone: Header = {};
  Object.keys(object).forEach((key) => {
    clone[key.toLowerCase()] = object[key]
  });
  return clone;
}

// 统一处理 ajax 结果
export const requestHandler = async <T = any>(instance: AxiosInstance, action: METHOD, url: string, config: IConfig = {}, reqdata:T) => {
  config.timeout = (config && config.timeout) || 0;
  if (config.headers) {
    config.headers = header2LowerCase(config.headers);
  }
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
