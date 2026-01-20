// Author: Amit Kumar
// Description: User authentication and utility routes
const express = require('express');
const router = express.Router();
// Import controller methods
// uuid       → Generates unique UUID (utility endpoint)
// createUser → Registers a new user
// login      → Authenticates user and returns token
const { uuid,createUser,login } = require('../controller/user.controller');

// User login route
// POST /login
// Body: { email, password }

router.post('/login', login);
// Create new user route
// POST /createUser
// Body: { name, email, password,amount }
router.post('/createUser', createUser);

// UUID generation route (utility / testing purpose)
// GET /uuidCreate
router.get('/uuidCreate', uuid);

module.exports = router;