import { AxiosInstance } from 'axios';
import { METHOD, Config } from './index';

const DEFAULT_TIMEOUT = 10000;

// 统一处理 ajax 结果
export const requestHandler = async <T = any>(instance: AxiosInstance, action: METHOD, url: string, config: Config = {}, reqdata:T) => {
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
