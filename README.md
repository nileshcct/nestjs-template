

# NestJS Scalable Auth Template

Production-grade NestJS authentication system with:
- Multi-provider auth (Email, Phone, OAuth)
- Session-based JWT
- Clean User/Auth separation

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

```
## Build before running migration
First run npm run build before running any migration
```bash
# mongo up migration
$ npm run mongo:migrate up

# mongo down migration
$ npm run mongo:migrate down
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
---

# Prisma Migrations & Schema Workflow

This project uses **Prisma Migrate** as the **single source of truth** for SQL schema changes.

All schema changes **must go through migrations**.
Direct database changes are forbidden.

---

## Folder Structure

```
prisma/
├── schema.prisma        # Prisma schema definition
└── migrations/          # Generated SQL migrations (DO NOT EDIT lightly)
```

---

## Schema Change Workflow

### Update the Prisma schema

Edit `prisma/schema.prisma`:

```prisma
model Role {
  id       String  @id @default(uuid())
  key      String  @unique
  name     String
  isSystem Boolean @default(true)
}
```

Save the file.

---

### Generate a new migration (Development)

```bash
npx prisma migrate dev --name <migration_name>
```

**What this does:**

* Compares schema with current database
* Generates a new migration folder
* Creates `migration.sql`
* Applies it to your local database
* Regenerates Prisma Client

Example:

```bash
npx prisma migrate dev --name add_roles_table
```

---

### Generate SQL only (No DB changes)

Use this when you want to:

* review SQL
* get DBA approval
* prepare production changes

```bash
npx prisma migrate dev --create-only --name <migration_name>
```

This will:

* generate `migration.sql`
* NOT apply it to the database

---

## Production Deployment

### Apply migrations in production

```bash
npx prisma migrate deploy
```

**Rules:**

* Runs only existing migrations
* Does NOT generate new migrations
* Safe for CI/CD and production

---

## Forbidden Commands (Production)

| Command              | Why                         |
| -------------------- | --------------------------- |
| `prisma migrate dev` | Mutates DB & schema history |
| `prisma db push`     | No migration history        |
| Manual SQL changes   | Causes schema drift         |

---

## Mental Model

```
schema.prisma
     ↓
prisma migrate dev
     ↓
migration.sql   ← source of truth
     ↓
prisma migrate deploy
```

The SQL file is the contract.
The schema is only a blueprint.

---

## Migration Files

Each migration lives here:

```
prisma/migrations/<timestamp>_<name>/migration.sql
```

* Review SQL before merging
* Never delete migrations once merged
* Never edit old migrations after deploy

---

## Best Practices

* One migration per logical change
* Clear, descriptive migration names
* Review generated SQL before merge
* Never squash migrations in shared branches
* Use `--create-only` for destructive changes

---

## Local Reset (Development Only)

```bash
npx prisma migrate reset
```

**WARNING:**
Drops and recreates the database.
Never run in production.

---

## Final Rules 

* Schema changes → migration
* SQL files are immutable
* Production uses `migrate deploy`
* No direct DB edits
* No shortcuts

---
