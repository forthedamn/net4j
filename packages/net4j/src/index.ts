import { AxiosRequestConfig, AxiosResponse } from "axios";
import Net from './net';

export default Net;

export interface Plugin {
  beforeRequest?(e?: Error, config?: AxiosRequestConfig, lib?: Lib): Config | Promise<Config>;
  // 向整个 net 体系注入依赖
  applyLib?<T>(lib: { [key: string]: T}): { [key: string]: T};
  afterRequest?<T = any>(e?: Error, response?: AxiosResponse<T>, lib?: Lib): AxiosResponse<T> | Promise<AxiosResponse<Error>>;
}

// Route 类型会被回填，这里无需关心类型
export interface GetRoute {[key: string]: {
  request?: any;
  response?: any;
}}

// Route 类型会被回填，这里无需关心类型
export interface PostRoute {[key: string]: {
  request?: any;
  response?: any;
}}

// Route 类型会被回填，这里无需关心类型
export interface PutRoute {[key: string]: {
  request?: any;
  response?: any;
}}

// Route 类型会被回填，这里无需关心类型
export interface DeleteRoute {[key: string]: {
  request?: any;
  response?: any;
}}

export interface Lib { [key: string]: Function }

export interface NetConfig {
  plugins?: Array<Plugin>,
  lib?: Lib;
  globalAxiosConfig?: Config,
}

// config 只需要在网络请求是回调类型即可，其他情况无需关注类型
export interface Config<T = any> extends AxiosRequestConfig {
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

