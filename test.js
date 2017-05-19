import request from './__mocks__/request';
import logger from './index';

const url = 'http://localhost/accept-log';
const UNSUPPORTED_METHOD = 'PUT';

describe('Sends message over the network', () => {
  test('GET', () => {
    const config = {
      url
    };

    const response = logger.bind({config})(2, ['hello', 'world']);
    return expect(response).resolves.toMatchObject({
      body: `${url}?l=error&m=hello%20world&to=3`
    });
  });

  test('POST', () => {
    const config = {
      method: 'POST',
      url
    };

    const response = logger.bind({config})(2, ['hello', 'world']);
    return expect(response).resolves.toMatchObject({
      body: '{"l":"error","m":"hello world","to":3}'
    });
  });
});

describe('Errors handling', () => {
  test('Url not set', () => {
    const config = {
      suppressRemoteErrors: false
    };

    expect(() => logger.bind({config})(2, ['hello', 'world'])).toThrow('Url must be set');
  });

  test('Invalid method', () => {
    const config = {
      method: UNSUPPORTED_METHOD,
      suppressRemoteErrors: false,
      url
    };

    expect(() => logger.bind({config})(2, ['hello', 'world'])).toThrow(`Method ${UNSUPPORTED_METHOD} is not supported`);
  });

  test('Invalid url during request', () => {
    const config = {
      suppressRemoteErrors: false,
      url: request.INVALID_URL
    };

    const response = logger.bind({config})(2, ['hello', 'world']);
    return expect(response).rejects.toEqual('invalid url');
  });

  test('Supress: Invalid url during request', () => {
    const config = {
      suppressRemoteErrors: true,
      url: request.INVALID_URL
    };

    const response = logger.bind({config})(2, ['hello', 'world']);
    return expect(response).resolves.toEqual(undefined);
  });
});
