# net4j-exception-plugin

Easily to set tip when request get exception.

```
import Net from 'net4j';
import { Modal } from 'antd';
import NetException, { PluginConfig } from 'net4j-exception-plugin';

// Merge plugin config to net4j config,then you can use it in every requst in net4j
declare module 'net4j' {
  interface IConfig extends PluginConfig {}
}

// Code to message
// Code comes from http status,response result.code,promise reject error.code
const codeMsgMap = {
  404: 'page not found',
  403: function() {
    // In this time, tipsComponent will not show.
    link.to('/login');
  },
  5400: '商品名重复'
}

const net = new Net({
  plugins: [
    otherPlugins...,
    // Exception plugin should be placed last
    new NetException({
      tipsComponent: Modal.error,
      defaultExceptionText: '请求异常，请重试', // Default is 'fail'
      codeMsgMap,
    }),
  ]
});

// When api/goods get exception，error modal will display;
await net.get('api/goods');
```
