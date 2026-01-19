// Author: Amit Kumar
const { initiateWithdrawal } = require('../services/withdrawal.service');

const sendResponse = require('../helper/response');


const createWithdrawal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { withdrawal_amount, destination } = req.body;
    const idempotencyKey = req.headers['idempotency-key'];

    // Validation error
    if (!idempotencyKey) {
      return sendResponse(res, {
        ok:false,
        status: 'error',
        message: 'Idempotency key required',
        statusCode: 400
      });
    }

    const withdrawal = await initiateWithdrawal(
      userId,
      withdrawal_amount,
      destination,
      idempotencyKey
    );

    return sendResponse(res, {
      ok:true,
      data: withdrawal,
      status: 'success',
      message: 'Withdrawal initiated successfully',
      statusCode: 201
    });

  } catch (err) {
    return sendResponse(res, {
      ok:false,
      status: 'error',
      message: err.message || 'Failed to create withdrawal',
      statusCode: 400
    });
  }
};

module.exports = {createWithdrawal};


