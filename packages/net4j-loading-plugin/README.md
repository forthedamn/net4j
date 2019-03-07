# net4j-loading-plugin

Easily to set loading toast when request pending.

```
import Net from 'net4j';
import { message } from 'antd';
import NetLoading, { NetConfig } from 'net4j-loading-plugin';

// Merge plugin config to net4j config,then you can use it in every requst in net4j
declare module 'net4j' {
  interface IConfig extends NetConfig {}
}

const net = new Net({
  plugins: [
    new NetLoading({
      loading: message.loading,
      defaultLoadingText: '加载中...', // Default is 'loading'
    }),
  ]
});

// When api/goods is pending, message loading will display and close when request finish;
await net.get('api/goods');
```
