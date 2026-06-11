# Grocery Shop API

A full-featured REST API backend for an e-commerce grocery shopping platform built with **Express v5**, **Prisma ORM**, and **Neon PostgreSQL**.

## ✨ Overview
The Grocery Shop API provides endpoints for managing users, products, categories, carts, orders, and favourites. It implements secure authentication with JWT, input validation using **Zod**, and follows best‑practice security headers with **helmet**.

## 🛠️ Tech Stack

| Dependency | Version | Purpose |
|---|---|---|
| **express** | ^5.2.1 | Web framework |
| **prisma** | ^6.19.3 | ORM & database schema |
| **@neondatabase/serverless** | latest | PostgreSQL driver (WebSocket) |
| **bcrypt** | latest | Password hashing |
| **jsonwebtoken** | latest | JWT auth tokens |
| **zod** | ^4.4.3 | Request validation |
| **helmet** | latest | Security headers |
| **dotenv** | latest | Environment variables |
| **cookie-parser** | latest | Cookie parsing |
| **cors** | latest | Cross‑origin requests |
| **brevo (Sendinblue)** | latest | Transactional emails |

## 📂 Project Structure
```
backend/
├── server.js                # Entry point
├── config/
│   └── db.js                # Neon pool config
├── lib/
│   ├── prisma.js            # PrismaClient singleton
│   └── audit.js             # Audit logging helper
├── prisma/
│   └── schema.prisma        # Database schema
├── middlewares/
│   ├── auth.middleware.js   # protect, authorize
│   └── validate.middleware.js
├── validators/
│   ├── auth.validator.js
│   ├── product.validator.js
│   └── order.validator.js
├── routes/                  # Route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── category.routes.js
│   ├── product.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   └── favourite.routes.js
├── utils/
│   ├── uploadToCloudinary.js # Cloudinary image uploader
│   └── cloudinary.js         # Cloudinary configuration
└── validators/ (continued)   # Request validators
```

## 🚀 Getting Started
### Prerequisites
- **Node.js** ≥ 20
- **npm** (comes with Node)
- A **Neon PostgreSQL** database instance (free tier works).
- A **Cloudinary** account for image uploads.

### Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/grocery-shop.git
cd grocery-shop

# Install backend dependencies
cd backend
npm install

# Install frontend (if you also want the UI)
cd ../frontend
npm install
```

### Environment Variables
Create a `.env` file in the `backend/` folder:
```
# Server
PORT=5000

# Database
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
> **Tip:** Use the `dotenvx` tool (included) to keep secrets encrypted.

### Run the Application
```bash
# Backend (auto‑restarts with nodemon)
npm start   # from backend directory

# Frontend (Vite dev server)
npm run dev   # from frontend directory
```
The API will be available at `http://localhost:5000`.

## 📋 API Documentation
| Resource | Method | Path | Description |
|---|---|---|---|
| **Auth** | POST | `/api/auth/register` | Register a new user |
|  | POST | `/api/auth/login` | Authenticate and receive a JWT |
| **Products** | GET | `/api/products` | List all products |
|  | POST | `/api/products` | Create a product (auth required) |
|  | GET | `/api/products/:id` | Get product details |
|  | PUT | `/api/products/:id` | Update product |
|  | DELETE | `/api/products/:id` | Delete product |
| **Categories** | GET | `/api/categories` | List categories |
| **Cart** | GET | `/api/cart` | Get current user's cart |
|  | POST | `/api/cart` | Add item to cart |
| **Orders** | POST | `/api/orders` | Place an order |
| **Favourites** | POST | `/api/favourites` | Toggle favourite product |

> **Note:** All protected routes require an `Authorization: Bearer <token>` header.

## 📦 Image Uploads
Products images are uploaded to Cloudinary via the utility `uploadToCloudinary(buffer, folder)`. The default folder is **grocery**, but you can pass a custom folder name.

## 🧪 Testing
```bash
# Run backend tests (if any)
npm test   # from backend directory
```
Feel free to add Jest or Vitest suites for your endpoints.

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/awesome-feature`)
3. Commit your changes
4. Open a Pull Request

Please adhere to the existing coding style and run `npm run lint` before submitting.

## 📄 License
This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---
## Screenshots

![](frontend/public/screenshots/Screenshot%202026-06-11%20111831.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20112308.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20112308.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20112318.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20112509.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20112528.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20112547.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20112606.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20112716.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20112230.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20111714.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20111756.png)
![](frontend/public/screenshots/Screenshot%202026-06-11%20111654.png)