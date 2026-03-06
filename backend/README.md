# EduSpark Backend ✨

Welcome to the EduSpark backend. This is a NestJS application using Prisma ORM with a MySQL database.

## 🚀 Getting Started

. Environment Setup
Create a `.env` file in the `backend` root 

### 3. Installation
```bash
$ pnpm install
```

### 4. Database Initialization
If you are setting up the database for the first time or after a schema change:
```bash
# Push schema to database
$ npx prisma db push

# Generate Prisma Client
$ npx prisma generate

```

### 5. Running the App
```bash
# development mode
$ pnpm run start:dev
```
The server will start on `http://localhost:4001`.

---

## 📖 API Documentation (Swagger)

EduSpark features an interactive Swagger portal where you can test all endpoints:

**URL:** [http://localhost:4001/api](http://localhost:4001/api)

### Quick Tips for Swagger:
1. **Authorize**: Click the **Authorize** button and enter your JWT token to access protected routes.
2. **Realistic Examples**: Look at the "Example Value" in each endpoint to see realistic UUID structures.
3. **Seeding**: Use the `POST /grade-groups/seed` endpoint to quickly populate the database with P1, P2, and P3 groups.

---

## 🛠 Tech Stack
- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: MySQL (Aiven)
- **API Docs**: Swagger / OpenAPI
- **Validation**: Class-validator / Class-transformer
