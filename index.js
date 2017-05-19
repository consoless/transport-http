const {LOG_LEVEL} = require('@consoless/core');
const xhr = require('request'); // Webpack converts it to `xhr` module for browsers

module.exports = transportHttp;

const supportedMethods = ['GET', 'POST'];
const logLevelMap = {
  [LOG_LEVEL.WARN]: 'warn',
  [LOG_LEVEL.ERROR]: 'error',
  [LOG_LEVEL.INFO]: 'info',
  [LOG_LEVEL.DEBUG]: 'log'
};

transportHttp.defaultConfig = {
  // fields: ['l', 'm', 'to'], // TODO setup sent fields
  method: 'GET',
  // Don't throw errors on remote request
  suppressRemoteErrors: true,
  url: null
};

function transportHttp(level, parts) {
  const logLevel = logLevelMap[level];
  const config = Object.assign({}, transportHttp.defaultConfig, this.config);

  if (!logLevel) {
    return null;
  }

  let options = {};
  const params = {
    // Level
    l: logLevel,
    // Message
    // TODO Think about interface which will return message instead of parts.
    // TODO Transformers should be responsible for parts concatenation?
    m: parts.join(' '),
    // Time offset
    to: -(new Date().getTimezoneOffset() / 60)
  };

  if (!config.url) {
    throw new Error(`Url must be set`);
  }

  if (!config.method) {
    throw new Error(`Method is not set`);
  }

  if (supportedMethods.indexOf(config.method) === -1) {
    throw new Error(`Method ${config.method} is not supported. Chose from ${supportedMethods.join(', ')}`);
  }

  if (config.method === 'GET') {
    const querySign = config.url.indexOf('?') === -1 ? '?' : '&';

    options.url = `${config.url}${querySign}${buildQuery(params)}`;
  } else if (config.method === 'POST') {
    options.body = JSON.stringify(params);
    options.headers = {
      'Content-type': 'application/json'
    };
  }

  // TODO add ability to set promise implementation. Better if it's done on global (consoless-core) level
  return new Promise((resolve, reject) => {
    xhr(Object.assign({
      method: config.method,
      url: config.url
    }, options), (err, resp) => {
      if (err && !config.suppressRemoteErrors) {
        return reject(err);
      }

      // Can be undefined in case if there is an error but they are suppressed
      resolve(resp);
    });
  });
}

function buildQuery(params) {
  const keys = Object.keys(params);

  if (keys.length === 0) {
    return '';
  }

  return keys.map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
}
