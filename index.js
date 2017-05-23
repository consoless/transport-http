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
  fieldsMap: null,
  method: 'GET',
  // Don't throw errors on remote request
  suppressRemoteErrors: true,
  url: null
};

/**
 * Sends message over the network
 * @param {string} level
 * @param {Array} parts
 * @return {Promise}
 */
function transportHttp(level, parts) {
  const logLevel = logLevelMap[level];
  const config = Object.assign({}, transportHttp.defaultConfig, this.config);

  // TODO Parameters validation should me moved out of transport implementation, because of consistency (one validation interface for every transport) and code coverage
  /* istanbul ignore if */
  if (!logLevel) {
    return null;
  }

  const options = {};
  const params = getParamsObj({
    level: logLevel,
    // TODO Think about interface which will return message instead of parts.
    // TODO Transformers should be responsible for parts concatenation? or probably after transformers concatenation should be done and concatenated string passed to transports
    message: parts.join(' '),
    timeOffset: -(new Date().getTimezoneOffset() / 60)
  }, config.fieldsMap);

  if (!config.url) {
    throw new Error(`Url must be set`);
  }

  if (config.method === 'GET') {
    const querySign = config.url.indexOf('?') === -1 ? '?' : '&';

    options.url = `${config.url}${querySign}${buildQuery(params)}`;
  } else if (config.method === 'POST') {
    options.body = JSON.stringify(params);
    options.headers = {
      'Content-type': 'application/json'
    };
  } else {
    throw new Error(`Method ${config.method} is not supported. Chose from ${supportedMethods.join(', ')}`);
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

/**
 *
 * @param {string} level
 * @param {string} message
 * @param {number} timeOffset
 * @param {{level, message, timeOffset} | null} fieldsMap
 * @return {{level, message, timeOffset}}
 */
function getParamsObj({level, message, timeOffset}, fieldsMap) {
  fieldsMap = fieldsMap || {};

  return {
    [fieldsMap.level || 'l']: level,
    [fieldsMap.message || 'm']: message,
    [fieldsMap.timeOffset || 'to']: timeOffset
  };
}

/**
 * Builds query string from object
 * @param params
 * @return {string}
 */
function buildQuery(params) {
  const keys = Object.keys(params);

  /* istanbul ignore if */
  if (keys.length === 0) {
    return '';
  }

  return keys.map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
}
