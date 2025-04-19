## simpleBank API

A RESTful API for a simple banking application, enabling user authentication, account management, and secure transactions.

## Features

- **User Authentication**: Register, login, and logout using JWT tokens for secure sessions. 
- **Account Management**: Create and retrieve bank accounts (Savings or Debit), each with unique account numbers and balances. 
- **Transactions**: Transfer funds between accounts atomically, ensuring consistency and handling insufficient funds. 
- **User Profile**: Fetch user details along with associated accounts, transaction history, and manage up to three favorite accounts. 
- **Caching and Persistence**: Utilizes MongoDB (via Mongoose) for data storage and Vercel KV (or Redis) for token blacklisting on logout. 

## Tech Stack

- **Node.js & Express**: Fast, unopinionated web framework for building APIs. 
- **MongoDB & Mongoose**: NoSQL database with a flexible schema and powerful ORM. 
- **JWT (jsonwebtoken)**: Secure token-based authentication. 
- **Redis / Vercel KV**: In-memory key-value store for session/token blacklisting. 
- **express-validator**: Request validation middleware ensuring data integrity. 

## Prerequisites

- Node.js v20.x
- npm (v8+) or Yarn
- MongoDB instance
- Vercel KV or Redis credentials

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ahmadsayed102/simpleBank-api.git
   cd simpleBank-api
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment variables**:
   Create a `.env` file in the root directory with:
   ```env
   MONGODBURI=your_mongodb_connection_string
   KV_REST_API_URL=your_vercel_kv_url
   KV_REST_API_TOKEN=your_vercel_kv_token
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

## Usage

- **Start the server**:
  ```bash
  npm start
  ```
  The API will be available at `http://localhost:3000`.

### Endpoints

| Method | Path                    | Description                                |
| ------ | ----------------------- | ------------------------------------------ |
| POST   | `/auth/register`        | Register a new user.                       |
| POST   | `/auth/login`           | Authenticate and retrieve a JWT token.     |
| POST   | `/auth/logout`          | Invalidate current JWT token.              |
| GET    | `/auth/test`            | Test authenticated route.                  |
| POST   | `/account/createAccount`| Create a new savings or debit account.     |
| GET    | `/account/getAccount`   | Retrieve account details by account number.|
| GET    | `/user/getUser`         | Get user profile, accounts, and favourites.|
| POST   | `/user/addFavourite`    | Add an account to favourites.              |
| POST   | `/user/deleteFavourite` | Remove an account from favourites.         |
| POST   | `/transactions/transfer`| Transfer funds between accounts.           |
| POST   | `/transactions/updateBalance`| Manually update account balance.     |

## Project Structure

```
├── api
│   ├── db.js             # Database connection logic
│   └── index.js          # Application entry point
├── controllers           # Request handlers
│   ├── auth
│   ├── account.js
│   ├── transactionController.js
│   └── user.js
├── middleware            # Custom middleware (auth, validation)
├── models                # Mongoose schemas
│   ├── Account.js
│   ├── Transaction.js
│   └── User.js
├── routes                # API route definitions
├── .env.example          # Sample environment file
└── package.json          # Project metadata & scripts
```

