# net4j-throttle-plugin

Throttle each request in waiting time.

> Only same method, url, params and data will be throttled.

```
import Net from 'net4j';
import NetThrottle, { ThrottleConfig } from 'net4j-throttle-plugin';

// Merge plugin config to net4j config,then you can use it in every requst in net4j
declare module 'net4j' {
  interface IConfig extends ThrottleConfig {}
}

const net = new Net({
  plugins: [
    new NetThrottle({
      wait: 2000, // default is 1000 ms
    }),
  ]
});

// api/goods with id=1 can only request once in 2 seconds
await net.get('api/goods', {params: {id: 1}});

// api/goods with id=2 can only request once in 2 seconds
await net.get('api/goods', {params: {id: 2}});
```
