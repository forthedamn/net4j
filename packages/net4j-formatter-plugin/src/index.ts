import { Plugin, Config as RootConfig } from 'net4j';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

type Formatter = (res: AxiosResponse) => any;
type PreFormatter = (config: RootConfig) => any;

export interface FormatterConfig extends RootConfig {
  formatter?: Formatter,
  preFormatter?: PreFormatter,
}

class FormatterPlugin implements Plugin {
  private formatter: Formatter | undefined;
  private preFormatter: PreFormatter | undefined;

  constructor(config: FormatterConfig = {}) {
    this.formatter = config.formatter;
    this.preFormatter = config.preFormatter;
  }

  beforeRequest(_e: Error, config: AxiosRequestConfig) {
    if (this.preFormatter) {
      return this.preFormatter(config);
    }
    return config;
  }

  afterRequest<T = any>(e: Error, response: T) {
    if (e) {
      return Promise.reject(e);
    }
    if (this.formatter && typeof this.formatter === 'function') {
      return this.formatter(response as any);
    }
    return response;
  }

}

export default FormatterPlugin;
