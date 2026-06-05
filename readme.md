# Grocery Shop API

A full-featured REST API backend for an e-commerce grocery shopping platform built with **Express v5**, **Prisma ORM**, and **Neon PostgreSQL**.

## Tech Stack

| Dependency | Purpose |
|---|---|
| Express ^5.2.1 | Web framework |
| Prisma ^6.19.3 | ORM & database schema |
| @neondatabase/serverless | PostgreSQL driver (WebSocket) |
| bcrypt | Password hashing |
| jsonwebtoken | JWT auth tokens |
| zod ^4.4.3 | Request validation |
| helmet | Security headers |
| dotenv | Environment variables |
| cookie-parser | Cookie parsing |
| cors | Cross-origin requests |
| brevo (Sendinblue) | Transactional emails |

## Project Structure

```
backend/
├── server.js              # Entry point
├── config/
│   └── db.js              # Neon pool config
├── lib/
│   ├── prisma.js          # PrismaClient singleton
│   └── audit.js           # Audit logging helper
├── prisma/
│   └── schema.prisma      # Database schema
├── middlewares/
│   ├── auth.middleware.js  # protect, authorize
│   └── validate.middleware.js
├── validators/
│   ├── auth.validator.js
│   ├── product.validator.js
│   └── order.validator.js
├── routes/                # Route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── category.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── favourite.routes.js
│   └── audit.routes.js
├── controllers/           # Business logic
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── category.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── order.controller.js
│   ├── favourite.controller.js
│   └── audit.controller.js
└── utils/
    └── sendEmail.js       # Brevo email API
```

## Getting Started

### Prerequisites

- Node.js >= 18
- A Neon PostgreSQL database (or any Postgres instance)

### Environment Variables

Create a `.env` file in the project **root** (`Grocery-Shop/.env`):

```env
PORT=5000
DATABASE_URL=postgresql://user:pass@ep-xxx.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=sender@email.com
```

### Install & Run

```bash
cd backend
npm install
npm start
```

The server starts on `http://localhost:5000` with nodemon auto-reload.

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/verify-email` | — | Verify email with 6-digit token |
| POST | `/api/auth/login` | — | Login, returns JWT cookie |
| POST | `/api/auth/logout` | — | Clear JWT cookie |
| POST | `/api/auth/forgot-password` | — | Send password reset email |
| POST | `/api/auth/reset-password/:token` | — | Reset password |

### User — `/api/user`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/user/` | any | Get own profile |
| GET | `/api/user/users` | admin | List all users |
| GET | `/api/user/:id` | admin | Get user by ID |
| PATCH | `/api/user/edit` | any | Update own profile |
| PATCH | `/api/user/edit/:id` | admin | Admin-update user |
| DELETE | `/api/user/delete/:id` | admin | Delete user |
| PATCH | `/api/user/block/:id` | admin | Block/unblock user |

### Category — `/api/category`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/category/add` | admin | Create category |
| GET | `/api/category/` | — | Get all categories |
| GET | `/api/category/:id` | — | Get category by ID |
| PUT | `/api/category/edit/:id` | admin | Update category |
| DELETE | `/api/category/delete/:id` | admin | Delete category |

### Product — `/api/product`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/product/` | — | List products (search, filter, paginate) |
| GET | `/api/product/:id` | — | Get product by ID |
| POST | `/api/product/add` | admin | Create product |
| PATCH | `/api/product/edit/:id` | admin | Update product |
| DELETE | `/api/product/delete/:id` | admin | Delete product |

Query params for `GET /api/product/`: `search`, `categoryId`, `minPrice`, `maxPrice`, `inStock`, `page`, `limit`

### Cart — `/api/cart`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/cart/add` | user | Add item to cart |
| GET | `/api/cart/` | any | Get cart items |
| DELETE | `/api/cart/:id` | any | Remove product from cart (by product ID) |
| DELETE | `/api/cart/` | any | Clear cart |
| PATCH | `/api/cart/increment/:id` | any | Increase quantity by 1 |
| PATCH | `/api/cart/decrement/:id` | any | Decrease quantity by 1 |

### Order — `/api/order`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/order/create` | user | Create order from cart (transactional, discount logic) |
| GET | `/api/order/` | user | Get own orders |
| GET | `/api/order/all` | admin | Get all orders |
| GET | `/api/order/:id` | admin | Get order by ID |
| PATCH | `/api/order/status/:id` | admin | Update order status |
| DELETE | `/api/order/cancel/:id` | any | Cancel own order (if pending/confirmed) |

### Favourite — `/api/favourite`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/favourite/add` | user | Add product to favourites |
| GET | `/api/favourite/` | user | List favourites |
| DELETE | `/api/favourite/:id` | user | Remove from favourites |

### Audit — `/api/audit`

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/audit/` | admin | Last 100 audit logs |
| GET | `/api/audit/:table/:id` | admin | Logs for a specific record |

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | "API running" |
| GET | `/users` | `SELECT NOW()` DB test |

---

## Authentication

- JWT is issued on login (7-day expiry) stored in an HTTP-only, SameSite=Strict cookie.
- The `protect` middleware reads the token from the `Authorization: Bearer` header or the `token` cookie.
- Role-based access via `authorize('admin')` middleware.

## Discount Logic

When creating an order, prices are calculated with two-tier discounts:

1. **Product discount** — `product.discount_percent` applied to base price
2. **User-type discount** — applied on top of the product-discounted price:
   - `student`: +10%
   - `vip`: +25%
   - `regular`: 0%

## Database

The schema is managed via Prisma. The database uses Neon PostgreSQL.

```bash
npx prisma generate   # Generate Prisma client
npx prisma migrate dev   # Run migrations
```

Key models: `User`, `Category`, `Product`, `CartItem`, `Order`, `OrderItem`, `Favourite`, `AuditLog`.

# Frontend still in work
