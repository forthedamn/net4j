import { IPlugin, IConfig as RootConfig } from 'net4j';
import { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

type Formatter = (res: AxiosResponse) => any;
type PreFormatter = (config: RootConfig) => any;
type ErrorFormatter = (e: AxiosError) => any

export interface FormatterConfig extends RootConfig {
  formatter?: Formatter,
  preFormatter?: PreFormatter,
  errorFormatter?: ErrorFormatter,
}

class FormatterPlugin implements IPlugin {
  private formatter?: Formatter;
  private preFormatter?: PreFormatter;
  private errorFormatter?: ErrorFormatter;

  constructor(config: FormatterConfig = {}) {
    this.formatter = config.formatter;
    this.preFormatter = config.preFormatter;
  }

  beforeRequest(_e: AxiosError, config: AxiosRequestConfig) {
    if (_e) {
      if (this.errorFormatter) {
        _e = this.errorFormatter(_e);
      }
      return Promise.reject(_e);
    }
    if (this.preFormatter) {
      return this.preFormatter(config);
    }
    return config;
  }

  afterRequest<T = any>(e: AxiosError, response: T) {
    if (e) {
      if (this.errorFormatter) {
        e = this.errorFormatter(e);
      }
      return Promise.reject(e);
    }
    if (this.formatter && typeof this.formatter === 'function') {
      return this.formatter(response as any);
    }
    return response;
  }

}

export default FormatterPlugin;
