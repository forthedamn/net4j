import { IPlugin, IConfig as RootConfig } from 'net4j';
import { AxiosResponse } from 'axios';

type Fomatter = (res: AxiosResponse) => any;

export interface FormatterConfig extends RootConfig {
  formatter?: Fomatter,
}

class FormatterPlugin implements IPlugin {
  private formatter: Fomatter;

  constructor(config: FormatterConfig = {}) {
    this.formatter = config.formatter;
  }

  afterRequest(e, response) {
    if (e) {
      return Promise.reject(e);
    }
    if (this.formatter && typeof this.formatter === 'function') {
      return this.formatter(response);
    }
    return response;
  }

}

export default FormatterPlugin;
