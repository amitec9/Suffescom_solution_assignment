// Author: Amit Kumar
const Queue = require('bull');
const withdrawalProcessor = require('../queues/withdrawal.worker');

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
};

const withdrawalQueue = new Queue('withdrawalQueue', { redis: redisConfig });

// Process jobs
withdrawalQueue.process(withdrawalProcessor);

withdrawalQueue.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

withdrawalQueue.on('failed', (job, err) => {
  console.log(`Job failed: ${job.id}, Error: ${err.message}`);
});

module.exports = withdrawalQueue;
