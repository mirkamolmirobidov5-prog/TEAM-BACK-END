# SmartBiz Backend — Do‘kon boshqaruv tizimi

Express.js + MongoDB + TypeScript asosida qurilgan Fullstack CRM backend qismi.

## 📦 Texnologiyalar

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Language**: TypeScript
- **Logging**: Winston + Morgan
- **Docs**: Swagger (OpenAPI 3)
- **Container**: Docker + Docker Compose

## 🏗 Arxitektura

```
Controller → Service → Model
```

- **AppError** + **catchAsync** — markazlashgan xatolarni boshqarish
- **Populate**, **Virtuals**, **Aggregation** ishlatilgan
- Transaction (session) orqali buyurtma yaratishda stock xavfsiz kamaytiriladi

## 🚀 Endpoints

| Method | Path              | Tavsif                                      |
|--------|-------------------|---------------------------------------------|
| GET    | `/api/v1/products`    | Mahsulotlar (pagination, sort, filter, search) |
| POST   | `/api/v1/products`    | Yangi mahsulot qo‘shish                     |
| POST   | `/api/v1/orders`      | Buyurtma yaratish (stock tekshiruvi bilan)  |
| GET    | `/api/v1/statistics`  | Savdo statistikasi (Aggregation)            |
| GET    | `/health`             | Health check                                |
| GET    | `/api-docs`           | Swagger UI                                  |

### Query parametrlar (GET /products)

- `page`, `limit` — pagination
- `sort` — masalan `-createdAt,price`
- `search` — nom / tavsif / kategoriya / sku
- `category` — kategoriya filtri
- `minPrice`, `maxPrice` — narx oralig‘i
- `inStock` — `true` | `false`

## 🛠 Lokal ishga tushirish

```bash
# 1. Dependencies
npm install

# 2. .env fayl
cp .env.example .env
# MONGODB_URI=mongodb://localhost:27017/smartbiz

# 3. MongoDB ishga tushgan bo‘lishi kerak

# 4. Development
npm run dev

# 5. Seed (ixtiyoriy)
npm run seed
```

## 🐳 Docker orqali

```bash
docker compose up --build -d
```

- API: http://localhost:5000
- Swagger: http://localhost:5000/api-docs
- MongoDB: localhost:27017

## 📁 Loyiha strukturasi

```
src/
├── config/          # DB, Swagger
├── controllers/     # Request/Response
├── services/        # Business logic
├── models/          # Mongoose schemas + Virtuals
├── routes/          # Express routers + Swagger annotations
├── middlewares/     # Error handler, 404
├── utils/           # AppError, catchAsync, logger, seed
├── types/           # TypeScript interfaces
├── app.ts
└── server.ts
```

## ✅ Talablar qondirilgan

- [x] Controller → Service → Model
- [x] AppError + catchAsync
- [x] Winston + Morgan logging
- [x] Populate (Order → Product)
- [x] Virtuals (`isInStock`, `itemsCount`)
- [x] Aggregation (statistics)
- [x] Swagger API docs
- [x] Docker + Docker Compose
- [x] Pagination, Sorting, Filtering, Search
- [x] Transaction bilan stock kamaytirish

---

**Keyingi qadam**: React frontend (mahsulotlar, forma, buyurtma, dashboard).
