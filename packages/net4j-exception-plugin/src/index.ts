import { IPlugin, IConfig as RootConfig } from 'net4j';
import { AxiosResponse } from 'axios';

const MIN_EXCEPTION_HTTP_CODE = 400;

export interface PluginConfig extends RootConfig {
  defaultExceptionText?: string;
  actionName?: string;
}

type codeFunc = (e?: AxiosResponse) => void | string;

interface Config {
  tipsComponent?: (code?: number, text?: string) => void;
  defaultExceptionText?: string;
  codeMsgMap?: (code?: number) => codeFunc;
  // Get business exception code
  bizExceptionCode?: (res: AxiosResponse) => { code?: string | number } | undefined;
}

class ExceptionPlugin implements IPlugin {
  private config: Config;
  private exceptionText: string;

  constructor(config: Config = {}) {
    this.config = config;
  }

  beforeRequest(e, config: PluginConfig) {
    if (e) {
      this.config.tipsComponent(undefined, e.message);
      return Promise.reject(e);
    }
    // For more flexible , every request can reset defaultExceptionText.
    // When request with defaultExceptionText:null, tipComponent will not show
    if (config.defaultExceptionText === null) {
      this.exceptionText = null;
    } else {
      this.exceptionText = (config.actionName || '') + (config.defaultExceptionText || this.config.defaultExceptionText || 'fail');
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

    // When request with defaultExceptionText:null, tipComponent will not show
    if (this.exceptionText === null) {
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
      (e && (e.msg || e.message)) || this.exceptionText;

    this.config.tipsComponent(code, message);

    if (res) return res;
  }
}

export default ExceptionPlugin;
