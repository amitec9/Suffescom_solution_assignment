// Author: Amit Kumar
const logger = require('../config/logger');
const crypto = require('crypto');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = requestId;

  // Capture response body
  const oldJson = res.json;
  let responseBody;

  res.json = function (body) {
    responseBody = body;
    return oldJson.call(this, body);
  };

  res.on('finish', () => {
    logger.info({
      request_id: requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      request_body: req.body,
      response_body: responseBody,
      duration_ms: Date.now() - start
    });
  });

  next();
};

module.exports = requestLogger;
