// Author: Amit Kumar
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
require('dotenv').config();

const generateIdempotencyKey = require('../helper/idempotency');
const sendResponse = require('../helper/response');

/**
 * REGISTER USER
 */
const createUser = async (req, res) => {
  try {
    const { name, email, password,amount } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, {
        ok: false,
        status: 'error',
        message: 'Name, email and password are required',
        statusCode: 400
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, {
        ok: false,
        status: 'error',
        message: 'User already exists',
        statusCode: 409
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    await Wallet.create({
      userId: user._id,
      balance: amount || 10000 // Default balance of 10,000 if not provided
    });

    return sendResponse(res, {
      ok: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      message: 'User registered successfully',
      statusCode: 201
    });

  } catch (err) {
    return sendResponse(res, {
      status: 'error',
      message: err.message,
      statusCode: 500
    });
  }
};

/**
 * LOGIN USER
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, {
        ok: false,
        status: 'error',
        message: 'Email and password are required',
        statusCode: 400
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, {
        ok: false,
        status: 'error',
        message: 'Invalid email or password',
        statusCode: 401
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, {
        ok: false,
        status: 'error',
        message: 'Invalid email or password',
        statusCode: 401
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendResponse(res, {
      ok: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      },
      message: 'Login successful'
    });

  } catch (err) {
    return sendResponse(res, {
      ok: false,
      status: 'error',
      message: err.message,
      statusCode: 500
    });
  }
};

/**
 * UUID / IDEMPOTENCY KEY
 */
const uuid = async (req, res) => {
  try {
    const uid = generateIdempotencyKey();

    return sendResponse(res, {
      ok: true,
      data: { idempotencyKey: uid },
      message: 'Idempotency key generated'
    });

  } catch (err) {
    return sendResponse(res, {
      ok: false,
      status: 'error',
      message: err.message,
      statusCode: 400
    });
  }
};

module.exports = {
  login,
  createUser,
  uuid
};
