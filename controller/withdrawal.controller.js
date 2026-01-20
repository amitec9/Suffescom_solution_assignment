// Author: Amit Kumar
// Description: Withdrawal controller – handles API request/response
const { initiateWithdrawal } = require('../services/withdrawal.service');

const sendResponse = require('../helper/response');

/**
 * Create Withdrawal API
 * - Validates request
 * - Extracts user context
 * - Calls service layer
 * - Sends standardized response
 */
const createWithdrawal = async (req, res) => {
  try {
      // Auth middleware injects user object
    const userId = req.user._id;
        // Request payload
    const { withdrawal_amount, destination } = req.body;
      if (!withdrawal_amount || !destination ) {
      return sendResponse(res, {
        ok: false,
        status: 'error',
        message: 'withdrawal_amount and destination are required',
        statusCode: 400
      });
    }
     // Idempotency key from headers
    const idempotencyKey = req.headers['idempotency-key'];

     /**
     * Validation: Idempotency key is mandatory
     * Prevents duplicate withdrawals on retries
     */
    if (!idempotencyKey) {
      return sendResponse(res, {
        ok:false,
        status: 'error',
        message: 'Idempotency key required',
        statusCode: 400
      });
    }
  /**
     * Delegate business logic to service layer
     */
    const withdrawal = await initiateWithdrawal(
      userId,
      withdrawal_amount,
      destination,
      idempotencyKey
    );

    /**
     * Success response
     */
    return sendResponse(res, {
      ok:true,
      data: withdrawal,
      status: 'success',
      message: 'Withdrawal initiated successfully',
      statusCode: 201
    });

  } catch (err) {
     /**
     * Error handling (service / validation / transaction failures)
     */
    return sendResponse(res, {
      ok:false,
      status: 'error',
      message: err.message || 'Failed to create withdrawal',
      statusCode: 400
    });
  }
};

module.exports = {createWithdrawal};


