## Prerequisites

Ensure the following are installed:

- PostgreSQL
- Node.js
- pnpm

## Setup Steps

1. Create a PostgreSQL database named `mapit`.

2. Create a `.env` file in the project root and set the database connection:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/mapit"
```

3. Run prisma migration

```sh
pnpm prisma migrate dev
```

4. generate prisma client

```sh
pnpm prisma generate
```

5. install deps

```sh
pnpm install
```

6. finally run the server

```sh
pnpm dev
```
