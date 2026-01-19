// Author: Amit Kumar
const express = require('express');
const router = express.Router();
const { createWithdrawal } = require('../controller/withdrawal.controller');
const auth = require('../middlewares/auth');

router.post('/', auth, createWithdrawal);

module.exports = router;
