// Author: Amit Kumar
// Description: Withdrawal routes (secured)

const express = require('express');
const router = express.Router();
// Controller handles withdrawal business logic
const { createWithdrawal } = require('../controller/withdrawal.controller');
// Authentication middleware (JWT )
// Ensures only authenticated users can initiate withdrawal
const auth = require('../middlewares/auth');
// Initiate withdrawal request
// POST /api/v1/withdraw
// Headers:
// token: <jwt-token>
//   idempotency-key: <unique-key>
// Body:
// {
//   "withdrawal_amount": 100,
//   "destination": "BANK123"
// }

router.post('/', auth, createWithdrawal);

module.exports = router;
