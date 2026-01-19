// Author: Amit Kumar
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const logger = require('./config/logger');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');

require('./config/db')();

const withdrawalRoutes = require('./routes/withdrawal.routes');
const userRoutes = require('./routes/user.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// 🔥 request/response logging
app.use(requestLogger);

app.use('/api/v1/withdraw', withdrawalRoutes);
app.use('/api/v1/user', userRoutes);

app.get('/', (req, res) => res.send('Payment Withdrawal Module Running ✅'));

// error logger
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
