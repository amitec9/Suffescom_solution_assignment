// Author: Amit Kumar
// Description: Application entry point – Express server setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const logger = require('./config/logger');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
// Database connection (MongoDB)
require('./config/db')();
// Route modules
const withdrawalRoutes = require('./routes/withdrawal.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const port = process.env.PORT || 3000;
/**
 * --------------------
 * Global Middlewares
 * --------------------
 */

// Security headers (XSS, clickjacking, etc.)
app.use(helmet());
// Enable CORS for cross-origin requests
app.use(cors());
// Parse incoming JSON payloads
app.use(bodyParser.json());
/**
 * --------------------
 * Logging Middleware
 * --------------------
 */

// Logs incoming requests & outgoing responses
app.use(requestLogger);
/**
 * --------------------
 * API Routes (Versioned)
 * --------------------
 */

app.use('/api/v1/withdraw', withdrawalRoutes);
app.use('/api/v1/user', userRoutes);
/**
 * --------------------
 * Health Check
 * --------------------
 */

app.get('/', (req, res) => res.send('Payment Withdrawal Module Running ✅'));

/**
 * --------------------
 * Error Handling (Always Last)
 * --------------------
 */

// Centralized error handler
app.use(errorHandler);

/**
 * --------------------
 * Server Startup
 * --------------------
 */

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
