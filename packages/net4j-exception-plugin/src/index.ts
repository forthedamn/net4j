import { IPlugin, IConfig as RootConfig } from 'net4j';
import { AxiosResponse } from 'axios';

const MIN_EXCEPTION_HTTP_CODE = 400;

export interface PluginConfig extends RootConfig {
  exceptionText?: string;
  actionName?: string;
  quiet?: boolean;
}

type codeFunc = (e?: AxiosResponse) => void | string;

interface Config {
  tipsComponent?: (code?: number, text?: string) => void;
  defaultExceptionText?: string;
  codeMsgMap?: (code?: number) => codeFunc;
  // Get business exception code
  bizExceptionCode?: (res: AxiosResponse) => { code?: string | number } | undefined;
  quiet?: boolean;
}

class ExceptionPlugin implements IPlugin {
  private config: Config;

  constructor(config: Config = {}) {
    this.config = config;
  }

  beforeRequest(e, config: PluginConfig) {
    if (e) {
      this.config.tipsComponent(undefined, e.message);
      return Promise.reject(e);
    }
    return config;
  }

  /**
   * res.code
   * e.code
   * e.response.code(http-code) 
   */
  afterRequest(e, res: AxiosResponse) {
    let code, errorHandler, info;

    // When request with exceptionText:null, tipComponent will not show
    if (res && res.config && ((res.config as PluginConfig).exceptionText === null || (res.config as Config).quiet === true)) {
      if (e) {
        return Promise.reject(e);
      }
      return res;
    }
    
    // http error code
    if (res && res.status >= MIN_EXCEPTION_HTTP_CODE) {
      code = res.status;
      info = res;
    }
    // get exception
    else if(e) {
      code = e.code || (e.response && e.response.code);
      info = e;
    }
    else if (res && this.config.bizExceptionCode) {
      const { code: _code } = this.config.bizExceptionCode(res) || {code: undefined };
      if (_code !== undefined) {
        code = _code;
        info = res;
      }
    }
    else {
      return res
    }

    // no code(biz error) and no error
    if (code === undefined && !e) {
      return res;
    }
    // errorHandler can be string or function
    errorHandler = this.config.codeMsgMap && this.config.codeMsgMap(code);

    if (typeof errorHandler === 'function') {
      return errorHandler(info);
    }

    const message = errorHandler || (res && res.data && (res.data.msg || res.data.message)) ||
      (e && (e.msg || e.message)) || this.config.defaultExceptionText || 'fail';

    this.config.tipsComponent(code, message);

    if (res) return res;
  }
}

export default ExceptionPlugin;
