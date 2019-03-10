# net4j

Pluggable & Promise based HTTP client for the browser and node.js

## Features

* Support Typescript
* Pluggable, easily unified processing
* Dependency injection
* Make XMLHttpRequests from the browser
* Make http requests from node.js
* Supports the Promise API
* Automatic transforms for JSON data

![gif](http://s0.meituan.net/bs/tempfs/file/zhongguoxin/cap0309.gif)

## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

[![Browser Matrix](https://saucelabs.com/open_sauce/build_matrix/axios.svg)](https://saucelabs.com/u/axios)


## Install

```bash
$ npm install net4j

$ yarn add net4j
```

## Example

### Normal Request

Performing a `GET` request

```ts
import Net from 'net4j';

const net = new Net();

// Type merge,so that /api/v2/goods will be typed
declare module 'net4j' {
  interface IGetRoute {
    '/api/v2/goods': {
      request: {
        id: number
      }
      response: {
        data: {
          GoodsInfo
        } 
      }
    },
  }
}

// `GET` request
// result will be typed with {data: {GoodsInfo}}
const result = await net.get('/api/v2/goods');
```

### With plugins

```ts
import Net from 'net4j';
import { message, Modal } from 'antd';
import NetLog from 'net4j-log-plugin';
import NetSuccess, { SuccessConfig } from 'net4j-success-plugin';
import NetLoading, { LoadingConfig } from 'net4j-loading-plugin';
import NetException, { ExceptionConfig } from 'net4j-exception-plugin';


declare module 'net4j' {
  // Merge plugin config to net4j config,then you can use it in every requst in net4j
  interface IConfig extends SuccessConfig, LoadingConfig, ExceptionConfig {};

  // Type merge,so that /api/v2/goods will be typed
  interface IGetRoute {
    '/api/v2/goods': {
      request: {
        id: number
      }
      response: {
        data: {
          GoodsInfo
        } 
      }
    },
  }
}

// Exception code to message
// Exception code comes from http status,response result.code,promise reject error.code
const codeMsgMap = {
  404: 'page not found',
  403: function() {
    // In this time, tipsComponent will not show.
    redirect('/login');
  },
  5400: 'Name repeat'
}

const net = new Net(plugins: [
  // Inject own log,so the exception and other operations will be reported
    new NetLog({
      log: {
        info: myLogger.info,
        error: myLogger.error,
      },
    }),
    // When request is pending, message loading will display and close when request finish
    new NetLoading({
      loading: message.loading,
    }),
    // When request completed successfully, message.success will display
    new NetSuccess({
      tipsComponent: message.success,
    }),
    // When request get exception，error modal will display and error will be auto reported
    new NetException({
      tipsComponent: Modal.error,
      codeMsgMap,
    }),
  ]);

// `GET` request
// result will be typed with {data: {GoodsInfo}}
const result = await net.get('/api/v2/goods', {params: {id: 123}});
```

## Plugins

* [net4j-success-plugin](https://github.com/forthedamn/net4j/tree/master/packages/net4j-success-plugin): Unified set 「success tip」 when request completed successfully.
* [net4j-loading-plugin](https://github.com/forthedamn/net4j/tree/master/packages/net4j-loading-plugin): Unified set 「loading toast」 when request pending.
* [net4j-exception-plugin](https://github.com/forthedamn/net4j/tree/master/packages/net4j-exception-plugin): Unified set 「error tip」 when request get exception.
* [net4j-log-plugin](https://github.com/forthedamn/net4j/tree/master/packages/net4j-log-plugin): Inject 「log libary」 in request, it will be used when request get exception or other critical operations

### How to write a plugin

```ts
export interface IPlugin {
  beforeRequest?(e?: Error, config?: AxiosRequestConfig, lib?: ILib): IConfig | Promise<IConfig>;
  // Inject libs to whole request, so other plugins use these libs 
  applyLib?(lib: { [key: string]: any}): { [key: string]: any};
  afterRequest?<T = any>(e?: Error, response?: T, lib?: ILib): T | Promise<AxiosResponse<Error>>;
}
```
