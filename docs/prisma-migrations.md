Here’s a **Prisma Migrations README** written for a **developer who is new to Prisma**, practical, and opinionated.

---

# Prisma Migrations Guide (Read This First)

This document explains **how Prisma migrations work**, **how to use them correctly**, and **how to avoid breaking the database**.

If you follow this guide, you will not get stuck with migration errors.

---

## What is a Prisma Migration?

A **migration** is a versioned change to the database schema.

Think of migrations like **Git commits for your database**:

* Applied once
* Never edited
* Always append-only

**Important rule**

> Once a migration is applied, it must NEVER be changed or deleted.

---

## Project Structure

```
project-root/
├── prisma/
│   ├── schema.prisma        # Source of truth (YOU EDIT THIS)
│   ├── migrations/          # Auto-generated SQL (DO NOT EDIT)
│   └── seed.ts              # Seed data
├── .env                     # DATABASE_URL
└── src/
```

---

## Source of Truth

### `schema.prisma` is the ONLY file you edit

Example:

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  age       Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

You **never manually edit SQL migrations**.

---

## Creating the First Migration

Run this once when starting the project:

```bash
npx prisma migrate dev --name init
```

This will:

1. Read `schema.prisma`
2. Generate SQL
3. Create a migration folder
4. Apply it to the database
5. Track it in `_prisma_migrations`

---

## Making Schema Changes (Daily Workflow)

### Example: Add a new column

#### 1. Update `schema.prisma`

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  age       Int
  phone     String?      // optional (NULL)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 2. Create a migration

```bash
npx prisma migrate dev --name add_user_phone
```

Prisma will generate SQL like:

```sql
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
```

#### 3. Commit migrations

```bash
git add prisma/migrations
git commit -m "db: add phone to users"
```

---

## Local vs Production Rules (VERY IMPORTANT)

### Local Development

Allowed:

* Reset database
* Delete migrations
* Start fresh

```bash
npx prisma migrate reset
```

---

### Production / Staging

NEVER:

* Reset DB
* Edit migrations
* Delete migration folders

ONLY run:

```bash
npx prisma migrate deploy
```

This applies **pending migrations only**.

---

## Rolling Back Changes (Important)

Prisma does **not support rollback**.

If you want to undo a change:

1. Update `schema.prisma`
2. Create a **new migration**

Example:

```bash
npx prisma migrate dev --name remove_user_phone
```

This creates:

```
init
add_user_phone
remove_user_phone
```

This is correct and expected.

---

## Common Mistakes

*  Editing an applied migration
*  Deleting migration folders after deployment
*  Using `db push` in production
*  Mixing manual SQL with Prisma migrations
*  Using NestJS `ConfigService` for Prisma CLI

---

## Correct Mental Model (Memorize This)

* `schema.prisma` → **write**
* `migrations/` → **read-only**
* Local → reset allowed
* Prod → reset forbidden
* Mistake → new migration

---

## Recommended Commands Cheat Sheet

```bash
# create migration
npx prisma migrate dev --name change_description

# reset local DB
npx prisma migrate reset

# deploy to prod
npx prisma migrate deploy

# open DB UI
npx prisma studio
```

---

## Final Rule

> **If Prisma asks to reset in production — STOP.
> Something is wrong. Fix migrations instead.**

---
