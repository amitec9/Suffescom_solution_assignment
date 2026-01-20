
# Payment Withdrawal Module

Secure & Scalable Payment Withdrawal Backend using Node.js + MongoDB + Bull Queue.

## Features
- Atomic wallet balance update
- Withdrawal with idempotency
- Transaction logs
- Asynchronous processing with Bull + Redis
- Simple JWT Auth (mocked)
- REST API with example Postman collection

---

## Setup

1. Clone repo
```bash
git clone https://github.com/amitec9/Suffescom_solution_assignment.git
cd Suffescom_solution_assignment
Install dependencies

bash
Copy code
npm install
Setup .env

ini
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/payment
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
Run Redis

bash
Copy code
docker run -p 6379:6379 redis


bash
Copy code
npm start
API Endpoints
Health Check
sql
Copy code
GET /
Initiate Withdrawal
makefile
Copy code
POST /api/v1/withdraw

Headers:
token 
  idempotency-key: unique-key
Body:
{
  "amount": 100,
  "destination": "BANK123"
}
Queue Workflow
User calls POST /api/v1/withdraw

Server validates idempotency key

Deducts balance atomically in MongoDB transaction

Creates withdrawal and transaction log

Pushes job to withdrawalQueue

Worker picks job, simulates payment processing, updates withdrawal and transaction log