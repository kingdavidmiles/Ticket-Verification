# Ticket Verification App

A secure, blockchain-backed ticket verification system for Event Organizers. This project demonstrates end-to-end verification of ticket sales by comparing the internal database count with the blockchain count.

## Architecture Overview

Three-tier architecture:

- Database (MySQL): events table storing `max_tickets`, `db_sales_count`, `token_address`.
- Backend:
  - Laravel: API endpoint `/api/verify-event-supply`, reads DB and calls the Node.js Web3 service.
  - Node.js Web3 service: uses Ethers.js to fetch `totalSupply()` from Mantle Mainnet.
- Frontend (React): Submits Event ID and displays verification status (`SYNC_SUCCESS`, `WEB3_SYNC_LAG`, `WEB3_CONNECTION_ERROR`) with a latency timer.

---

## Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8
- npm or yarn
- Internet connection for Mantle RPC

---

## 1. Database Setup

Create database and user:

```sql
CREATE DATABASE ticket_verification;

CREATE USER 'laravel_user'@'localhost' IDENTIFIED BY 'strongpassword';
GRANT ALL PRIVILEGES ON ticket_verification.* TO 'laravel_user'@'localhost';
FLUSH PRIVILEGES;
```

Update Laravel `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ticket_verification
DB_USERNAME=laravel_user
DB_PASSWORD=strongpassword

WEB3_SERVICE_URL=http://localhost:4000/web3/verify-supply
```

Run migrations and seeders:

```bash
php artisan migrate
php artisan db:seed --class=EventSeeder
```

---

## 2. Laravel Backend

Install dependencies and start server:

```bash
composer install
php artisan serve
```

Default URL: http://127.0.0.1:8000

API endpoint:

```
GET /api/verify-event-supply
```

Example JSON response:

```json
{
  "max_tickets": 1000,
  "db_sales_count": 500,
  "blockchain_count": "36184111457099",
  "verification_status": "WEB3_SYNC_LAG",
  "timestamp": 1763583979000
}
```

---

## 3. Node.js Web3 Service

Install and run:

```bash
cd web3-service
npm install
```

`.env` for web3 service:

```env
RPC_URL=https://mantle-mainnet.infura.io/v3/657fa15d10704344b3a4a948230b068d
PORT=4000
```

Start service:

```bash
node index.js
```

Test endpoint:

```bash
curl -X POST http://localhost:4000/web3/verify-supply \
  -H "Content-Type: application/json" \
  -d '{"token_address":"0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9"}'
```

---

## 4. React Frontend

Install and start:

```bash
cd frontend
npm install
npm run dev
```

Access locally: http://localhost:5173 (Vite default)

Enter Event ID `101` to view verification result.

Deployment: upload to Vercel or Netlify for a live demo.

---

## 5. Environment Variables

Laravel `.env` (repeat):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ticket_verification
DB_USERNAME=laravel_user
DB_PASSWORD=strongpassword
WEB3_SERVICE_URL=http://localhost:4000/web3/verify-supply
```

Node.js `.env`:

```env
RPC_URL=https://mantle-mainnet.infura.io/v3/657fa15d10704344b3a4a948230b068d
PORT=4000
```

React `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api/verify-event-supply
```

---

## 6. Architecture Justification

- Separation of Concerns: Laravel manages app logic and DB; Node.js Web3 service handles blockchain interactions.
- Scalability: Web3 service can be scaled independently.
- Security: Laravel mediates blockchain data; clients do not call RPC directly.
- UX: React presents clear, state-driven feedback with latency info.

---

## 7. Submission Checklist

- GitHub repo: https://github.com/yourusername/ticket-verification
- Live React demo: https://ticket-verification.vercel.app
- Fully working Laravel backend, Node.js Web3 service, React frontend
