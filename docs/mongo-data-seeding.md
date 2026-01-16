Here’s a **straight, production-ready `README.md`** for **MongoDB data seeding** 

---

# MongoDB Data Seeding (Mongoose)

This project uses a **deterministic data seeding system** for MongoDB built on **Mongoose**.
Seeds are executed **once**, **in order**, and are safe to run in local, staging, and CI environments.

---

## Purpose

Data seeding is used to:

* Insert **required system data** (roles, permissions, configs)
* Bootstrap **admin users**
* Populate **reference data**
* Ensure consistent environments

> Seeding is **not** migrations.
> Seeds may be environment-specific and may be re-runnable if written correctly.

---

## Folder Structure

```
mongo/
└── seeds/
    ├── 001-roles.seed.ts
    ├── 002-permissions.seed.ts
    ├── 003-admin-user.seed.ts
    ├── seed.model.ts
    ├── index.ts
    └── runner.ts
```

---

## Seed Rules (Mandatory)

1. **Filename prefix controls execution order**

   ```
   001-*.seed.ts
   002-*.seed.ts
   ```
2. Each seed **must export `run()`**
3. Seeds must be **idempotent**
4. Seeds must **not assume DB state**
5. Seeds must **not call `process.exit()`**

---

## Example Seed

```ts
// 001-roles.seed.ts
import { RoleModel } from '../schemas/role.schema';

export async function run() {
  const roles = ['ADMIN', 'USER'];

  for (const role of roles) {
    await RoleModel.updateOne(
      { name: role },
      { $setOnInsert: { name: role } },
      { upsert: true }
    );
  }
}
```

---

## Seed History Tracking

Seeds are tracked in a dedicated MongoDB collection to ensure:

* Each seed runs **once**
* Re-execution is prevented
* Deterministic behavior across environments

---

### `seed.model.ts`

```ts
import { Schema, model, Document } from 'mongoose';

export interface SeedDocument extends Document {
  name: string;
  executedAt: Date;
}

const SeedSchema = new Schema<SeedDocument>({
  name: { type: String, required: true, unique: true },
  executedAt: { type: Date, required: true },
});

export const SeedModel = model<SeedDocument>('Seed', SeedSchema);
```

---

## Seed Loader (`index.ts`)

* Dynamically loads all `.seed.js` files
* Sorts by filename
* Enforces seed contract

```ts
readdirSync()
  .filter(f => f.endsWith('.seed.js'))
  .sort();
```

---

## Seed Runner (`runner.ts`)

The runner:

* Loads environment variables
* Opens **one MongoDB connection**
* Runs seeds sequentially
* Skips already executed seeds
* Closes the connection safely

---

## Environment Variables

Create a `.env` file at project root:

```env
MONGO_URL=mongodb://localhost:27017/my_database
```

> The seed runner does **not** use NestJS `ConfigModule`.

---

## Running Seeds

### Development

```bash
npm run mongo:seed
```

### CI / Production

```bash
MONGO_URL=mongodb://prod-db:27017/app npm run mongo:seed
```

---

## Build Requirement

Seeds run from **compiled JavaScript**:

```bash
npm run build
npm run mongo:seed
```

Ensure:

* `.seed.ts` → `.seed.js`
* `.env` is available at runtime

---

## Common Mistakes (Avoid)

Hard-coding ObjectIds
Inserting duplicates
Using `insertMany` without checks
Calling `process.exit()` inside seeds
Mixing seeding with migrations

---

## Best Practices

* Use `upsert` with `$setOnInsert`
* Log meaningful output
* Keep seeds **small and focused**
* Never delete production data in seeds
* Treat seeds as **re-runnable**

---

## Differences: Seeds vs Migrations

| Migrations         | Seeds           |
| ------------------ | --------------- |
| Structural changes | Data insertion  |
| Immutable          | Can evolve      |
| Must run once      | Can be re-run   |
| Affects schema     | Affects content |

---

## Optional Enhancements

This seeding system can be extended with:

* `--only <seed>`
* `--reset`
* Environment-based seeding
* Dry-run mode
* Seed grouping

---

## Summary

✔ Deterministic
✔ Safe
✔ CI-friendly
✔ Idempotent
✔ No framework coupling

This is the **correct way** to seed MongoDB data in production systems.

---
