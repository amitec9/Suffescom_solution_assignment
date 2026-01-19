// Author: Amit Kumar
const sendResponse = require('../helper/response');
const errorHandler = (err, req, res, next) => {
  sendResponse(res, {
    ok: false,
    data: null,
    status: 'error',
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500
  });
};

module.exports = errorHandler;