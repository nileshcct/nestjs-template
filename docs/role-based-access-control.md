# RBAC (Role-Based Access Control) Schema

## How Users Get Roles (Critical Concept)

Permissions are **never** assigned directly to users.

Users get **roles**, and roles grant **permissions**.

This is non-negotiable for a scalable system.

---

## Why Roles Are Assigned to Users (Not Permissions)

Assigning permissions directly to users causes:

* Permission explosion
* Inconsistent access rules
* Impossible auditing
* Painful migrations

Roles solve this by acting as **stable access contracts**.

> A user’s access level is defined by *who they are*, not by ad-hoc permissions.

---

## User ↔ Role Relationship (Conceptual)

You will need a separate table user_role table:

```
User ──< UserRole >── Role
```

### Typical `UserRole` model

```prisma
model UserRole {
  id        String   @id @default(uuid())
  userId    String
  roleId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Restrict)

  @@unique([userId, roleId])
  @@map("user_roles")
}
```

* A user can have **multiple roles**
* Roles are reusable and centrally managed
* Removing a role immediately removes all its permissions

---

## How a User Gets a Role (Real Scenarios)

### 1. System-Assigned Roles (Most Common)

Roles assigned automatically by backend logic.

Examples:

* New user signs up → `CUSTOMER`
* Admin creates a staff account → `SUPPORT`
* Internal tooling user → `ADMIN`

```ts
await prisma.userRole.create({
  data: {
    userId,
    role: { connect: { key: "CUSTOMER" } }
  }
})
```

Used when:

* Role is mandatory
* User should not choose it
* Security matters

---

### 2. Admin-Assigned Roles (Controlled)

Roles assigned manually by admins via an admin panel.

Examples:

* Promote `CUSTOMER` → `SELLER`
* Add `SUPPORT` role temporarily
* Grant `ADMIN` access (restricted)

Rules:

* Only privileged users can do this
* `isSystem = true` roles may require extra checks

---

### 3. Business-State–Driven Roles

Roles assigned based on verified business conditions.

Examples:

* KYC approved → `SELLER`
* Subscription active → `PREMIUM_USER`
* Partner contract signed → `PARTNER`

This is usually handled via **domain events** or workflows.

---

### 4. Temporary or Contextual Roles (Advanced)

Less common, but sometimes required.

Examples:

* `MODERATOR` for 24 hours
* `AUDITOR` during an investigation

Handled by:

* Expiry timestamps in `UserRole`
* Or computed roles at runtime

---

## What NOT To Do

Do NOT assign permissions directly to users
Do NOT hardcode permissions in frontend
Do NOT rely on role names instead of keys
Do NOT let users self-assign privileged roles

If you do any of the above, you will regret it.

---

## Authorization Flow (End-to-End)

1. User authenticates
2. User roles are loaded
3. Roles resolve to permissions
4. Permission is checked for requested action
5. Request is allowed or denied

```
User → Roles → Permissions → Authorization Decision
```

---

## Key Takeaway

* **Users get roles**
* **Roles own permissions**
* **Permissions never touch users directly**

This keeps your system:

* Predictable
* Secure
* Auditable
* Easy to change without breaking prod

---

**Role-Based Access Control (RBAC)** 

RBAC answers one simple question:

> **What actions is a user allowed to perform?**

This is done by:

* Defining **permissions**
* Grouping permissions into **roles**
* Assigning roles to users (user–role mapping is assumed elsewhere)

---

## High-Level Overview

```
Role ──< RolePermission >── Permission
```

* A **Role** can have many permissions
* A **Permission** can belong to many roles
* `RolePermission` is the join table that connects them

This design is:

* Scalable
* Explicit
* Production-grade
* Easy to audit and evolve

---

## Models Explained

---

## 1. Permission

```prisma
model Permission {
  id         String @id @default(uuid())
  key        String @unique
  domain     String
  action     String
  version    Int @default(1)
  deprecated Boolean @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  rolePermissions RolePermission[]
  @@map("permissions")
}
```

### What is a Permission?

A **permission** represents **one atomic capability** in the system.

Examples:

* `user.create`
* `user.read`
* `order.update`
* `order.cancel`

### Important Fields

| Field                   | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `id`                    | Primary key (UUID)                                           |
| `key`                   | **Globally unique identifier** (e.g. `order.create`)         |
| `domain`                | Logical area of the app (e.g. `order`, `user`)               |
| `action`                | What can be done (e.g. `create`, `read`, `update`, `delete`) |
| `version`               | Used for permission evolution / backward compatibility       |
| `deprecated`            | Marks permissions that should no longer be used              |
| `createdAt / updatedAt` | Audit timestamps                                             |

### Why `domain` + `action` instead of only `key`?

* Makes permissions **queryable**
* Easier to group and reason about
* Prevents random string chaos

---

## 2. Role

```prisma
model Role {
  id          String @id @default(uuid())
  key         String @unique
  name        String
  description String?
  isSystem    Boolean @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  rolePermissions RolePermission[]
  @@map("roles")
}
```

### What is a Role?

A **role** is a named collection of permissions.

Examples:

* `ADMIN`
* `CUSTOMER`
* `SUPPORT`
* `SELLER`

Roles are what you actually assign to users.

### Important Fields

| Field                   | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `id`                    | Primary key                                      |
| `key`                   | Stable identifier used in code (`ADMIN`)         |
| `name`                  | Human-readable name                              |
| `description`           | Optional explanation                             |
| `isSystem`              | Prevents deletion/modification of critical roles |
| `createdAt / updatedAt` | Audit timestamps                                 |

### Why `key` and `name` both?

* `key` → used in backend logic
* `name` → used in UI / admin panels

Never rely on `name` in code.

---

## 3. RolePermission (Join Table)

```prisma
model RolePermission {
  id           String @id @default(uuid())
  roleId       String
  permissionId String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@map("role_permissions")
}
```

### What is RolePermission?

This table links **roles ↔ permissions**.

Each row means:

> “This role has this permission”

### Why not a simple array?

* Prisma + SQL require explicit many-to-many tables
* Allows:

  * Auditing
  * Future metadata (e.g. grantedBy, expiresAt)
  * Clean deletes

### Constraints

* `@@unique([roleId, permissionId])`

  * Prevents duplicate permission assignment
* `onDelete: Cascade`

  * Deleting a role or permission cleans up automatically

---

## Example Data

### Permissions

| key            | domain | action |
| -------------- | ------ | ------ |
| `user.create`  | user   | create |
| `user.read`    | user   | read   |
| `order.cancel` | order  | cancel |

### Roles

| key        | name          |
| ---------- | ------------- |
| `ADMIN`    | Administrator |
| `CUSTOMER` | Customer      |

### RolePermission

| role     | permission   |
| -------- | ------------ |
| ADMIN    | user.create  |
| ADMIN    | user.read    |
| ADMIN    | order.cancel |
| CUSTOMER | order.cancel |

---

## How This Is Used in Code (Typical Flow)

1. User logs in
2. User has one or more roles
3. Roles resolve to permissions
4. Backend checks permission before executing action

Example (conceptual):

```ts
if (!hasPermission(user, "order.cancel")) {
  throw new ForbiddenError()
}
```

---

## Design Decisions (Why This Is Production-Grade)

* UUIDs → safe for distributed systems
* Explicit join table → scalable & auditable
* `deprecated` flag → safe permission migrations
* `isSystem` → protects core roles
* No magic enums → database-driven access control

---

## What This Schema Does NOT Do

This schema **does not**:

* Assign roles to users
* Handle authentication
* Enforce permissions automatically

Those belong in:

* `UserRole` table
* Auth middleware
* Authorization layer

---

## Summary

* **Permission** = one action
* **Role** = group of actions
* **RolePermission** = link between them

Simple, explicit, scalable — exactly how RBAC should be done in a serious backend.

---

If you want, next logical steps are:

* `UserRole` model
* Permission check middleware
* Seeding strategy
* Caching permissions for performance

Just say the word.

