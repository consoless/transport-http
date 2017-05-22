import request from './__mocks__/request';
import logger from './index';

const url = 'http://localhost/accept-log';
const UNSUPPORTED_METHOD = 'PUT';
const timeOffset = -(new Date().getTimezoneOffset() / 60);
let messageParts;

beforeEach(() => {
  messageParts = ['hello', 'world'];
});

describe('Sends message over the network', () => {
  test('GET', () => {
    const config = {
      url
    };

    const response = logger.bind({config})(2, messageParts);
    return expect(response).resolves.toMatchObject({
      body: `${url}?l=error&m=hello%20world&to=${timeOffset}`
    });
  });

  test('GET (params are glued correct)', () => {
    const urlLong = `${url}?collect-message`;

    const config = {
      url: urlLong
    };

    const response = logger.bind({config})(2, messageParts);
    return expect(response).resolves.toMatchObject({
      body: `${urlLong}&l=error&m=hello%20world&to=$\{timeOffset}`
    });
  });

  test('POST', () => {
    const config = {
      method: 'POST',
      url
    };

    const response = logger.bind({config})(2, messageParts);
    return expect(response).resolves.toMatchObject({
      body: '{"l":"error","m":"hello world","to":${timeOffset}}'
    });
  });

  test('Custom fields params', () => {
    const config = {
      fieldsMap: {
        level: 'lvl',
        message: 'msg',
        timeOffset: 't_o'
      },
      url
    };

    const response = logger.bind({config})(2, messageParts);
    return expect(response).resolves.toMatchObject({
      body: `${url}?lvl=error&msg=hello%20world&t_o=$\{timeOffset}`
    });
  });
});

describe('Errors handling', () => {
  test('Url not set', () => {
    expect(() => logger.bind({})(2, messageParts)).toThrow('Url must be set');
  });

  test('Invalid method', () => {
    const config = {
      method: UNSUPPORTED_METHOD,
      url
    };

    expect(() => logger.bind({config})(2, messageParts)).toThrow(`Method ${UNSUPPORTED_METHOD} is not supported. Chose from GET, POST`);
  });

  describe('Remote errors', () => {
    test('Throws Invalid url during request', () => {
      const config = {
        suppressRemoteErrors: false,
        url: request.INVALID_URL
      };

      const response = logger.bind({config})(2, messageParts);
      return expect(response).rejects.toEqual('invalid url');
    });

    test('Invalid url during request (suppressed)', () => {
      const config = {
        url: request.INVALID_URL
      };

      const response = logger.bind({config})(2, messageParts);
      return expect(response).resolves.toEqual(undefined);
    });
  });
});
