import { Plugin } from 'net4j';

export interface ILib {
  log?: ILog
}

interface ILog {
  info: (...args) => void;
  error: (...args) => void;
}

interface Config {
  log: ILog;
}

class LogPlugin implements Plugin{
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  applyLib(lib: ILib = {}) {
    lib.log = this.config.log;
    return lib;
  }

}

export default LogPlugin;
