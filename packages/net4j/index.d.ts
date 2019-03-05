import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IPlugin {
  beforeRequest?(e?: Error, config?: AxiosRequestConfig): IConfig | Promise<IConfig>;
  request?<T = any>(method: METHOD, url:string, config?: IConfig, data?: any): Promise<T>;
  afterRequest?<T = any>(e?: Error, response?: T): T | Promise<AxiosResponse<Error>>;
}

export interface IGetRoute {}

export interface IPostRoute {}

export interface IPutRoute {}

export interface IConfig extends AxiosRequestConfig {
  plugins?: Array<IPlugin>,
}

export interface IDeleteRoute {}

export enum METHOD {
  GET,
  POST,
  PUT,
  DELETE,
}

export enum LifeTimeEnum {
  beforeRequest = 'beforeRequest',
  afterRequest = 'afterRequest',
  request = 'request',
}

declare class Net4j {
    netConfig: IConfig;
    private pluginsList;
    constructor(config: any);
    private initPlugins;
    private request;
    get<URL extends keyof IGetRoute>(url: URL, config?: IConfig): Promise<IGetRoute[URL]>;
    post<URL extends keyof IPostRoute>(url: URL, postdata?: any, config?: IConfig): Promise<IPostRoute[URL]>;
    put<URL extends keyof IPutRoute>(url: URL, pudata?: any, config?: IConfig): Promise<IPutRoute[URL]>;
    dlt<URL extends keyof IDeleteRoute>(url: URL, config?: IConfig): Promise<IDeleteRoute[URL]>;
}
export default Net4j;
