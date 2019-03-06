import { IPlugin, IConfig as RootConfig } from 'net4j';

const MIN_EXCEPTION_HTTP_CODE = 400;

export interface NetConfig extends RootConfig {
  defaultExceptionText?: string;
}

type codeFunc = (e?: any) => void;

interface IConfig {
  tipsComponent?: (code?: number, text?: string) => void;
  defaultExceptionText?: string;
  codeMsgMap?: {[key: string]: string | codeFunc};
}

class ExceptionPlugin implements IPlugin {
  private config: IConfig;
  private exceptionText: string;

  constructor(config: IConfig = {}) {
    this.config = config;
  }

  beforeRequest(e, config: NetConfig) {
    if (e) {
      this.config.tipsComponent(undefined, e.message);
      return Promise.reject(e);
    }
    // For more flexible , every request can reset defaultExceptionText.
    this.exceptionText = (config.actionName || '') + (config.defaultExceptionText || this.config.defaultExceptionText || 'fail');
    return config;
  }

  /**
   * res.code
   * e.code
   * e.response.code(http-code) 
   */
  afterRequest(e, res) {
    let code, errorHandler, info;
    if (res && res.code >= MIN_EXCEPTION_HTTP_CODE) {
      code = res.code;
      info = res;
    } else {
      code = e.code || e.response.code;
      info = e;
    }
    // errorHandler can be string or function
    errorHandler = this.config.codeMsgMap && this.config.codeMsgMap[code];

    if (typeof errorHandler === 'function') {
      errorHandler(info);
      return;
    }

    const message = errorHandler || (res && (res.msg || res.message)) ||
      (e && (e.msg || e.message)) || this.exceptionText;

    this.config.tipsComponent(code, message);

    if (res) return res;    
  }
}

export default ExceptionPlugin;
