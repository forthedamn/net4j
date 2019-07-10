import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import Net from './net';

export default Net;

export interface IPlugin {
  beforeRequest?(e?: Error, config?: AxiosRequestConfig, lib?: ILib): IConfig | Promise<IConfig>;
  // 向整个 net 体系注入依赖
  applyLib?(lib: { [key: string]: any}): { [key: string]: any};
  afterRequest?(e?: Error, response?: AxiosResponse, lib?: ILib): any;
}

// Route 类型会被回填，这里无需关心类型
export interface IGetRoute {[key: string]: {
  request?: any;
  response?: any;
}}

// Route 类型会被回填，这里无需关心类型
export interface IPostRoute {[key: string]: {
  request?: any;
  response?: any;
}}

// Route 类型会被回填，这里无需关心类型
export interface IPutRoute {[key: string]: {
  request?: any;
  response?: any;
}}

// Route 类型会被回填，这里无需关心类型
export interface IDeleteRoute {[key: string]: {
  request?: any;
  response?: any;
}}

export interface ILib { [key: string]: Function }

export interface INetConfig {
  plugins?: Array<IPlugin>,
  lib?: ILib;
  globalAxiosConfig?: IConfig,
}

// config 只需要在网络请求是回调类型即可，其他情况无需关注类型
export interface IConfig<T = any> extends AxiosRequestConfig {
  data?: T;
  params?: T;
  restful?: {[key: string]: string};
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

