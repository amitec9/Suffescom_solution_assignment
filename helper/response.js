// Author: Amit Kumar
const crypto = require('crypto');

const sendResponse = (res, { ok,data = null, status = 'success', message = '', statusCode = 200, requestId = null }) => {
  if (!requestId) {
    requestId = crypto.randomUUID(); // generate unique request ID
  }

  return res.status(statusCode).json({
    ok,
    data,
    request_id: requestId,
    status,
    message
  });
};

module.exports = sendResponse;
