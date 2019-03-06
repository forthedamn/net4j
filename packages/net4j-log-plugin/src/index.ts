import { IPlugin } from 'net4j';

export interface ILib {
  log: ILog
}

interface ILog {
  info: (...args) => void;
  error: (...args) => void;
}

interface IConfig {
  log: ILog;
}

class LogPlugin implements IPlugin{
  private config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  applyLib(lib) {
    lib.log = this.config.log;
    return lib;
  }

}

export default LogPlugin;
