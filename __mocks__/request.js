'use strict';

module.exports = fakeRequest;

function fakeRequest(options, callback) {
  const response = {};

  if (options.url.indexOf(fakeRequest.INVALID_URL) !== -1) {
    // Error during request
    return callback('invalid url');
  }

  if (options.method === 'GET') {
    // Not actually a body, but for test purposes it's ok
    response.body = options.url;
  } else if (options.method === 'POST') {
    response.body = options.body;
  }

  callback(null, response);
}

fakeRequest.INVALID_URL = '[INVALID_URL]';
