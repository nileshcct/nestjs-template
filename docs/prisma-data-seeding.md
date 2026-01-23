Here’s a **separate, production-grade README for seed data**, written for **large-scale, real-world apps** (NestJS + Prisma mindset).

---

# Prisma Seed Data Guide (Large-Scale Apps)

This document explains **how to design, structure, and run seed data** in a real-world Prisma application.

Seed data is **not demo data**.
It is **deterministic, repeatable, environment-aware data** required for the app to function.

---

## What Seed Data Is (and Is Not)

### Seed data IS:

* Default roles (ADMIN, USER, etc.)
* System users
* Feature flags
* Permissions
* Reference/master data
* Dev/test bootstrap data

### Seed data is NOT:

* Random fake data
* One-off SQL inserts
* Production user data
* Anything that must not be re-created

---

## When Seed Data Runs

| Command                 | Seeds run? |
| ----------------------- | ---------- |
| `prisma migrate reset`  | YES        |
| `prisma db seed`        | YES        |
| `prisma migrate deploy` | NO         |

 **Seeds never auto-run in production** unless you explicitly run them.

---

## Recommended Folder Structure (Scalable)

```
prisma/
├── schema.prisma
├── seed/
│   ├── index.ts          # entry point
│   ├── roles.seed.ts
│   ├── users.seed.ts
│   ├── permissions.seed.ts
│   ├── feature-flags.seed.ts
│   └── utils.ts
└── migrations/
```

**Never put all seed logic in one file** for large apps.

---

## Example Real-World Models

```prisma
model Role {
  id   String @id @default(uuid())
  name String @unique
  users User[]
}

model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
  role  Role   @relation(fields: [roleId], references: [id])
  roleId String
}

model FeatureFlag {
  key     String @id
  enabled Boolean @default(false)
}
```

---

## Seed Entry Point

### `prisma/seed/index.ts`

```ts
import { PrismaClient } from '@prisma/client';
import { seedRoles } from './roles.seed';
import { seedUsers } from './users.seed';
import { seedFeatureFlags } from './feature-flags.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await seedRoles(prisma);
  await seedUsers(prisma);
  await seedFeatureFlags(prisma);

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error('Seeding failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## Example 1: Roles (Idempotent, Safe)

### `roles.seed.ts`

```ts
import { PrismaClient } from '@prisma/client';

const ROLES = ['ADMIN', 'USER', 'MODERATOR'] as const;

export async function seedRoles(prisma: PrismaClient) {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  console.log(' Roles seeded');
}
```

**Why `upsert`?**

* Safe to re-run
* No duplicates
* Required for large apps

---

## Example 2: System Users

### `users.seed.ts`

```ts
import { PrismaClient } from '@prisma/client';

export async function seedUsers(prisma: PrismaClient) {
  const adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' },
  });

  if (!adminRole) throw new Error('ADMIN role missing');

  await prisma.user.upsert({
    where: { email: 'admin@system.local' },
    update: {},
    create: {
      email: 'admin@system.local',
      name: 'System Admin',
      roleId: adminRole.id,
    },
  });

  console.log('System users seeded');
}
```

---

## Example 3: Feature Flags (Very Common in Large Apps)

### `feature-flags.seed.ts`

```ts
import { PrismaClient } from '@prisma/client';

const FLAGS = [
  { key: 'new_dashboard', enabled: false },
  { key: 'beta_checkout', enabled: false },
];

export async function seedFeatureFlags(prisma: PrismaClient) {
  for (const flag of FLAGS) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }

  console.log('Feature flags seeded');
}
```

---

## Enable Seeding in Prisma

### `package.json`

```json
{
  "prisma": {
    "seed": "ts-node prisma/seed/index.ts"
  }
}
```

---

## Running Seeds

### Local reset (common)

```bash
npx prisma migrate reset
```

### Manual seed

```bash
npx prisma db seed
```

---

## Environment Awareness (IMPORTANT)

In large apps, seeds should respect environment:

```ts
if (process.env.NODE_ENV === 'production') {
  console.log('Skipping dev-only seeds');
  return;
}
```

Typical pattern:

* Prod → only reference/system data
* Dev/Test → extra users, flags, mocks

---

## Golden Rules for Seed Data

1. **Seeds must be idempotent**
2. **Use `upsert`, never `create` blindly**
3. **Never depend on auto-increment IDs**
4. **Never delete user data in seeds**
5. **Seed order matters (relations first)**
6. **Never auto-run seeds in production**

---

## What NOT to Seed

* Real customer data
* Large fake datasets (use factories instead)
* Time-sensitive data
* One-time migrations

---

## Seed vs Migration (Know the Difference)

| Migrations     | Seeds       |
| -------------- | ----------- |
| Schema changes | Data setup  |
| Required       | Optional    |
| Run once       | Re-runnable |
| SQL based      | App logic   |
| Immutable      | Editable    |

---

## Recommended Workflow

```bash
# schema change
npx prisma migrate dev --name add_feature_flags

# seed updates
npx prisma db seed
```

---

## Final Rule (Memorize This)

> **If seed data breaks your app when re-run, it is wrong.**

---
