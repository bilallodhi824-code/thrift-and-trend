# 🚀 Thrift & Trend — Complete Full-Stack Deployment Guide
**Brand Tagline:** *Where Style Meets Savings*  
**Official Live Website:** [https://thrift-and-trend.vercel.app](https://thrift-and-trend.vercel.app) (also [https://thriftandtrend.vercel.app](https://thriftandtrend.vercel.app))  
**Official Instagram:** [@thriftandtread](https://www.instagram.com/thriftandtread?rpxt=MThkazBjd253NXd4cQ==)  
**GitHub Repository:** [https://github.com/bilallodhi824-code/thrift-and-trend](https://github.com/bilallodhi824-code/thrift-and-trend)  
**Database:** Microsoft SQL Server 2022 / 2025 (MSSQL)  
**Backend:** Node.js + Express + TypeScript + Zod + JWT  
**Frontend:** React 18 + TypeScript + Vite + Tailwind CSS  

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Local Setup (Windows + SQL Server Express)](#local-setup-windows--sql-server-express)
3. [Docker 1-Click Deployment (Production)](#docker-1-click-deployment-production)
4. [Cloud Deployment (Azure / AWS / Render / VPS)](#cloud-deployment-azure--aws--render--vps)
5. [Database Schema & Migrations](#database-schema--migrations)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Default Test Accounts](#default-test-accounts)

---

## 🏗️ Architecture Overview

```
                      ┌──────────────────────────────────────────┐
                      │    React + Vite Single Page Application  │
                      │    (Port 5173 / Port 80 Nginx)           │
                      └─────────────────────┬────────────────────┘
                                            │ REST / JSON (JWT Auth)
                                            ▼
                      ┌──────────────────────────────────────────┐
                      │    Express + TypeScript API Server       │
                      │    (Port 5000 /api)                      │
                      └─────────────────────┬────────────────────┘
                                            │ Direct Pool / Shared Memory Bridge
                                            ▼
                      ┌──────────────────────────────────────────┐
                      │    Microsoft SQL Server (MSSQL)          │
                      │    Database: ThriftAndTrendDB            │
                      │    Tables: Users, Products, Orders...    │
                      └──────────────────────────────────────────┘
```

---

## 💻 Local Setup (Windows + SQL Server Express)

### Prerequisites:
- Node.js v18+ or v20+
- Microsoft SQL Server Express running locally (`localhost\SQLEXPRESS`)
- SQLCMD CLI (ODBC Driver 18 for SQL Server)

### Step 1: Install Dependencies
```powershell
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### Step 2: Initialize & Seed MSSQL Database
Run the schema script against your local SQL Server instance:
```powershell
sqlcmd -S "localhost\SQLEXPRESS" -E -C -i server/database/schema.sql
```
Then populate with 12 studio-curated footwear grails and default accounts:
```powershell
cd server
node dist/seed.js
cd ..
```

### Step 3: Run the Full-Stack Locally
Run the backend in terminal 1:
```powershell
cd server
npm run dev
# Running at http://localhost:5000/api
```
Run the frontend in terminal 2:
```powershell
npm run dev
# Running at http://localhost:5173
```

---

## 🐳 Docker 1-Click Deployment (Production)

The repository includes a production-ready `docker-compose.yml` that provisions:
1. **MSSQL 2022 Linux Container** (`mcr.microsoft.com/mssql/server:2022-latest`)
2. **Backend API Container** (Node 20 Alpine with auto-compilation)
3. **Frontend Nginx Container** (Reverse proxy + optimized static assets)

### Run with Docker Compose:
```bash
docker compose up --build -d
```

- **Frontend:** `http://localhost`
- **Backend API:** `http://localhost/api` or `http://localhost:5000/api`
- **MSSQL Port:** `1433` (User: `sa`, Password: `Password123!`)

---

## ☁️ Cloud Deployment

### Option 1: Azure App Service + Azure SQL Database (Recommended)
1. Provision an **Azure SQL Database** named `ThriftAndTrendDB`.
2. Run `server/database/schema.sql` in Azure Query Editor.
3. Deploy `server/` to **Azure App Service (Node.js Linux)** and set the connection environment variables:
   - `DB_SERVER=<your-server>.database.windows.net`
   - `DB_NAME=ThriftAndTrendDB`
   - `DB_USER=<your-sql-user>`
   - `DB_PASSWORD=<your-sql-password>`
   - `DB_ENCRYPT=true`
   - `DB_TRUST_SERVER_CERT=false`
4. Deploy the frontend build (`dist/`) to **Azure Static Web Apps** or **Vercel/Netlify**.

### Option 2: Windows Server / VPS (IIS or PM2)
1. Install PM2: `npm install -g pm2`
2. Build both projects:
   ```powershell
   npm run build
   cd server && npm run build
   ```
3. Start backend daemon:
   ```powershell
   pm2 start dist/server.js --name "thrift-backend"
   ```
4. Serve frontend using IIS or Caddy/Nginx pointing to `dist/`.

---

## 🗄️ Database Schema & Tables

The database schema is defined in `server/database/schema.sql`:

1. **`Users`**: User ID, FullName, Email (Unique), PasswordHash (Bcrypt), Role (`customer` | `admin`), Phone, Shipping Address, City, PostalCode, CreatedAt.
2. **`Products`**: Product ID, Slug, Name, Subtitle, Category, Gender, Condition (`10/10 Deadstock`, `9.5/10 Like New`, etc.), Price, OriginalPrice, Rating, ReviewCount, Badge, Stock, Description, Story, FitAdvice, CareInstructions, AuthenticationNotes.
3. **`ProductColors`**: Available colorways per shoe with hex accents.
4. **`ProductImages`**: Multi-angle studio photography.
5. **`ProductSizes`**: EU sizing matrix with live stock inventory.
6. **`Orders`**: Order ID (`TT-ORD-XXXXXX-XXX`), UserID, Customer info, Shipping address, Subtotal, Savings below retail, Shipping fee, Total, Order Status, Live Tracking Number (`TRK-TT-XXXXXXXX`).
7. **`OrderItems`**: Itemized lines per order.
8. **`Wishlists`**: Saved customer grails.

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer with address | No |
| `POST` | `/api/auth/login` | Login with email & password (returns JWT) | No |
| `GET` | `/api/auth/profile` | Retrieve active customer profile | Bearer Token |
| `PUT` | `/api/auth/profile` | Update address / phone info | Bearer Token |

### 👟 Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Retrieve catalog with filters & sorting | No |
| `GET` | `/api/products/:slug` | Retrieve single shoe with colors & sizes | No |

### 📦 Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/orders` | Place order, calculate savings & return tracking # | Optional (Guest or User) |
| `GET` | `/api/orders` | Get logged-in user's order vault history | Bearer Token |
| `GET` | `/api/orders/:id` | Get specific order tracking details | Bearer Token |

### 🛠️ Admin Management (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Executive KPI analytics (Revenue, Orders, Savings, Stock) | Admin Token |
| `GET` | `/api/admin/orders` | Full order vault with items & customer details | Admin Token |
| `PATCH` | `/api/admin/orders/:id/status` | Update order fulfillment status & tracking number | Admin Token |
| `POST` | `/api/admin/products` | Create & insert new footwear grail into MSSQL | Admin Token |
| `PUT` | `/api/admin/products/:id` | Update product price, stock, condition, or badge | Admin Token |
| `DELETE` | `/api/admin/products/:id` | Cascade delete product from MSSQL | Admin Token |
| `GET` | `/api/admin/customers` | Registered customers registry with order metrics | Admin Token |

---

## 👤 Admin Test Account

| Role | Email | Password | Access |
|---|---|---|---|
| **Master Administrator** | `admin@thrift&trend.com` | `Thirift&trend@@2026` | Complete Admin Dashboard & MSSQL Control |
*(Real customers create their own accounts via the Registration form)*
