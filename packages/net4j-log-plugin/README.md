# net4j-log-plugin

Log for request

```

import Net from 'net4j';
import NetLog from 'net4j-log-plugin';

const net = new Net({
  plugins: [
    new NetLog({
      log: {
        info: console.log,
        error: console.error,
      },
    }),
  ]
});

```
