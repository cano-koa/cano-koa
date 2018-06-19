const logger = require('koa-logger');

module.exports = [
    logger(),
    ({ response }, next) => {
      try {
        next();
      } catch (err) {
        cano.log.error(err);
        response.body = err;
      }
    },
];
