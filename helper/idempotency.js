// Author: Amit Kumar
const crypto = require('crypto');

const generateIdempotencyKey = () => crypto.randomUUID();
module.exports = generateIdempotencyKey;
