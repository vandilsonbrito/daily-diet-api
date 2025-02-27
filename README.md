# Meal Tracker API

## Description
The Meal Tracker API allows users to manage their meals by creating, updating, deleting, and retrieving meal records. The API also provides user authentication with JWT and metrics on meal tracking, including total meals, meals within the diet, meals outside the diet, and the best sequence of meals within the diet.

## Table of Contents
- [Features](#features)
- [Endpoints](#endpoints)
- [Environment Variables / Setup & Installation](#environment-variables--setup--installation)
- [Technologies Used](#technologies-used)
- [Contacts](#contacts)

## Features
- User authentication using JWT
- User registration
- Meal logging with details (name, description, date, time, and diet status)
- Meal modification
- Meal deletion
- Fetching all meals for a user
- Viewing a specific meal
- Retrieving user metrics

## Authentication
This API uses JWT (JSON Web Token) for authentication. Users must include a valid token in the `Authorization` header as a Bearer token when accessing protected routes.

## Endpoints

### User Routes
- **POST /user/create** - Register a new user.
- **POST /user/login** - Authenticate and receive a JWT token.

### Meal Routes
- **POST /meals** - Log a new meal (Authenticated).
- **PUT /meals/:id** - Update an existing meal (Authenticated).
- **DELETE /meals/:id** - Delete a meal (Authenticated).
- **GET /meals** - Get all meals for the authenticated user.
- **GET /meals/:id** - View a specific meal.

### User Metrics
- **GET /user/metrics** - Retrieve the total number of meals, meals within the diet, meals outside the diet, and the best sequence of meals within the diet.

## Environment Variables / Setup & Installation
The application requires a `.env` file with the following variables:

```
NODE_ENV=development
DATABASE_URL="./db/app.db"
DATABASE_CLIENT=sqlite
PORT=5000

# Secret key for the server to assign and verify JWT tokens
SECRET_KEY=
```

# Setup & Installation
1. Clone the repository:
   ```sh
   https://github.com/vandilsonbrito/daily-diet-api.git
   ```
2. Navigate to the project folder:
   ```sh
   cd meal-tracker-api
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create the `.env` file from `.env.example` and configure the required variables.
5. Run database migrations:
   ```sh
   npm run knex -- migrate:latest
   ```
6. Start the server:
   ```sh
   npm run dev
   ```

## Technologies Used
- **Fastify** - Web framework for Node.js
- **Knex.js** - SQL query builder
- **SQLite** - Database
- **fastify-jwt** - JWT authentication
- **Zod** - Input validation

## Usage
Use tools like Postman or Insomnia to interact with the API endpoints. Make sure to include the JWT token in the `Authorization` header when making requests to protected routes.

---
Feel free to contribute or open issues if you find any bugs! 🚀

### Contacts
- Made with ❤️ by Vadilson Brito
- LinkedIn: [Vandilson](https://www.linkedin.com/in/vandilson-brito-desenvolvedor-frontend/)
- Portfolio: [Portfolio-link](https://vandilson-portfolio.vercel.app)

