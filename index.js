const {LOG_LEVEL} = require('@consoless/core');
const xhr = require('request'); // Webpack converts it to `xhr` module for browsers

const supportedMethods = ['GET', 'POST'];
const logLevelMap = {
  [LOG_LEVEL.WARN]: 'warn',
  [LOG_LEVEL.ERROR]: 'error',
  [LOG_LEVEL.INFO]: 'info',
  [LOG_LEVEL.DEBUG]: 'log'
};

function buildQuery(params) {
  const keys = Object.keys(params);

  if (keys.length === 0) {
    return '';
  }

  return '?' + keys.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])).join('&');
}

module.exports = function(level, parts) {
  const logLevel = logLevelMap[level];

  if (logLevel) {
    let options = {};
    const params = {
      l: logLevel,
      m: parts.join(' '),
      to: -(new Date().getTimezoneOffset() / 60)
    };

    if (!this.config.url) {
      throw new Error(`Url must be set`);
    }

    if (!this.config.method) {
      throw new Error(`Method is not set`);
    }

    if (supportedMethods.indexOf(this.config.method) === -1) {
      throw new Error(`Method ${this.config.method} is not supported. Chose from ${supportedMethods.join(', ')}`);
    }

    if (this.config.method === 'GET') {
      options.url = this.config.url + buildQuery(params);
    } else if (this.config.method === 'POST') {
      options.body = JSON.stringify(params);
    }

    xhr(Object.assign({
      method: this.config.method,
      url: this.config.url,
      json: true
    }, options), err => {
      if (err && this.config.throwIfError) {
        throw new Error(err);
      }
    });
  }
};

module.exports.defaults = {
  method: 'GET',
  url: '',
  throwIfError: false,
  fields: ['l', 'm', 'to'] // TODO setup sent fields
};
