# net4j-formatter-plugin

Format response data.

```
import Net from 'net4j';
import NetFormatter, { FormatterConfig } from 'net4j-formatter-plugin';

const net = new Net({
  plugins: [
    new NetFormatter({
      formatter: (res) => {
        return {
          myData: res.data
        }
      }
    }),
  ]
});


const res = await net.get('api/goods', {params: {id: 1}});

console.log(res.myData)

```
