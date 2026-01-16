Here’s a **clean,`README.md`** for your **MongoDB migration system**.

---

# MongoDB Migrations (Mongoose)

This project uses a **custom, deterministic migration system** for MongoDB built on top of **Mongoose**.
Migrations are executed sequentially, tracked, and safe to run multiple times.

---

## Why this exists

MongoDB does **not** have native migrations like SQL databases.

This system provides:

* Ordered migrations
* Single DB connection
* Idempotent execution
* Safe CI/CD usage
* Prisma-style discipline (without Prisma)

---

## Folder Structure

```
mongo/
└── migrations/
    ├── 001-add-phone-field.migrate.ts
    ├── 002-backfill-users.migrate.ts
    ├── 003-add-index.migrate.ts
    ├── index.ts
    └── runner.ts
```

---

## Migration Rules (Important)

1. **File naming controls order**

   ```
   001-*.migrate.ts
   002-*.migrate.ts
   ```
2. Each migration **must export an `up()` function**
3. Migrations must be **idempotent**
4. Do **not** assume schema state
5. Do **not** call `process.exit()` inside a migration

---

## Example Migration

```ts
// 001-add-phone-field.migrate.ts
import { model } from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';

export async function up() {
  const UserModel = model<User>('User', UserSchema);

  await UserModel.updateMany(
    { phone: { $exists: false } },
    { $set: { phone: null } }
  );
}
```

---

## Migration Loader (`index.ts`)

* Dynamically loads all `.migrate.js` files
* Sorts them lexicographically
* Ensures deterministic execution

```ts
readdirSync()
  .filter(f => f.endsWith('.migrate.js'))
  .sort();
```

---

## Migration Runner (`runner.ts`)

* Loads environment variables
* Opens **one MongoDB connection**
* Runs migrations sequentially
* Closes connection safely

```bash
npm run mongo:migrate
```

---

## Environment Variables

Create a `.env` file at project root:

```env
MONGO_URL=mongodb://localhost:27017/my_database
```

> The migration runner **does not use NestJS ConfigModule**.
> Environment variables must be available at runtime.

---

## Running Migrations

### Development

```bash
npm run mongo:migrate
```

### Production / CI

```bash
MONGO_URL=mongodb://prod-db:27017/app npm run mongo:migrate
```

---

## Build Requirement

Migrations are executed from compiled JavaScript:

```bash
npm run build
npm run mongo:migrate
```

Ensure:

* `.migrate.ts` → `.migrate.js`
* `.env` is available at runtime

---

## Common Mistakes (Avoid These)

Using `!` instead of env guards
Calling `process.exit()` inside migrations
Importing migrations manually
Running migrations in parallel
Assuming schema state

---

## Best Practices

* Always use `$exists` checks
* Never delete data inside migrations without backups
* Log meaningful output
* Test migrations on a staging DB
* Treat migrations as **immutable**

---

## Optional Enhancements

This system can be extended with:

* Migration tracking collection
* Rollbacks (`down()`)
* CLI flags (`--only`, `--from`)
* Dry runs
* Locking to prevent concurrent execution

---

## Summary

✔ Deterministic
✔ Safe
✔ CI-friendly
✔ No NestJS dependency
✔ No magic

This is how MongoDB migrations should be done in real production systems.

---

