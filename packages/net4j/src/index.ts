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

export interface IGetRoute {[key: string]: {
  request?: any;
  response?: any;
}}

export interface IPostRoute {[key: string]: {
  request?: any;
  response?: any;
}}

export interface IPutRoute {[key: string]: {
  request?: any;
  response?: any;
}}

export interface IDeleteRoute {[key: string]: {
  request?: any;
  response?: any;
}}

export interface ILib extends LogLib{}

export interface IConfig<T = any> extends AxiosRequestConfig {
  plugins?: Array<IPlugin>,
  timeout?: number;
  lib?: ILib & { [key: string]: any};
  data?: T;
  params?: T;
  cancelRequst?: boolean;
}

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

