import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ILib as LogLib } from 'net4j-log-plugin';
import Net from './net';

export default Net;

export interface IPlugin {
  beforeRequest?(e?: Error, config?: AxiosRequestConfig, lib?: ILib): IConfig | Promise<IConfig>;
  // 向整个 net 体系注入依赖
  applyLib?(lib: { [key: string]: any}): { [key: string]: any};
  request?<T = any>(method: METHOD, url:string, config?: IConfig, data?: any): Promise<T>;
  afterRequest?<T = any>(e?: Error, response?: T, lib?: ILib): T | Promise<AxiosResponse<Error>>;
}

export interface IGetRoute {}

export interface IPostRoute {}

export interface IPutRoute {}

export interface ILib extends LogLib{}

export interface IConfig extends AxiosRequestConfig {
  plugins?: Array<IPlugin>,
  timeout?: number;
  lib?: ILib & { [key: string]: any};
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

