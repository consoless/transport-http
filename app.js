const logger = require('./index');

const config = {
  method: 'GET',
  url: 'http://localhost',
  throwIfError: true
};

logger.bind({config})(2, ['hello', 'world']);
