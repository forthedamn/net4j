import axios from 'axios';
import { METHOD, IConfig, IPlugin, LifeTimeEnum } from '..';

const DEFAULT_TIMEOUT = 10000;

// 统一处理 ajax 结果
export const requestHandler = async (action: METHOD, url: string, config: IConfig, reqdata: any = {}) => {
  config = config || {};
  config.timeout = (config && config.timeout) || DEFAULT_TIMEOUT;
  let ret;
  switch(action) {
    case METHOD.GET:
      ret = await axios.get(url, config);
      break;
    case METHOD.POST:
      ret = await axios.post(url, reqdata, config);
      break;
    case METHOD.PUT:
      ret = await axios.put(url, reqdata, config);
      break;
    case METHOD.DELETE:
      ret = await axios.delete(url, config);
      break;
    default:
      break;
  };
  return ret;
}

const pluginWalker = (lifeTime: LifeTimeEnum, pluginsList: IPlugin) => {
}
