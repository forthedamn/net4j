const sinon = require('sinon');
const axios = require('axios');
const expect = require('expect');

const Net4j = require('../build/index').default;
const loadingPlugin = require('../../net4j-loading-plugin/build/index').default;

describe('net4j', () => {
  const sandbox = sinon.createSandbox();
  let loadingFlag = '';
  const net = new Net4j({plugins: [
    new loadingPlugin({loading: () => {
      loadingFlag = 'before';
      expect(loadingFlag).toEqual('before');
      return () => {
      }
    }
  })
  ]});

  afterEach(() => {
    sandbox.restore();
  });

  it('Request with plugin', (done) => {
    sandbox.stub(axios, 'get').callsFake(() => {
      return Promise.resolve('test');
    });
    net.get('test').then(res => expect(res).toEqual('test')).then(done);
  });
});
