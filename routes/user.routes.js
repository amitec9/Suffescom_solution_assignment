// Author: Amit Kumar
const express = require('express');
const router = express.Router();
const { uuid,createUser,login } = require('../controller/user.controller');


router.post('/login', login);
router.post('/createUser', createUser);
router.get('/uuidCreate', uuid);

module.exports = router;