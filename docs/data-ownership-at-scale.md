# Database Design: Ownership & Authorization at Scale

## The Golden Rule of Ownership in Production Databases

**If a resource can be owned by a user/account, the database itself must be able to prove ownership in a single query.**

This is not optional once you care about:

- Security
- Performance at scale
- Correct authorization
- Avoiding subtle data leaks

## Catalog / System-owned entities (global – no ownership)

These usually **do NOT** need `userId` / `accountId`:

```text
Product
Category
Brand
Inventory (global stock)
Promotion / Coupon rules
TaxRule
```

→ Everyone (or large groups) can see them → no per-user ownership filter needed.

## User-owned or Account-owned entities (MUST have ownership field)

```text
orders
payments
carts / wishlists
addresses
saved payment methods
reviews (sometimes)
return requests
subscriptions
```

**Anti-patterns that WILL hurt you at scale**

```text
-- Looks clean but dangerous
SELECT * FROM orders 
WHERE id = ? 
-- and you check in code: if order.user_id == current_user.id
```

Why this is bad:

1. You forgot the check once → data leak
2. You can't efficiently shard by user
3. Every query needs application-level filtering
4. Hard to audit / reason about access control

## What big companies (Amazon, Flipkart, Shopify, etc.) actually do

They **intentionally denormalize** ownership:

```sql
CREATE TABLE orders (
    id              BIGINT          PRIMARY KEY,
    account_id      BIGINT          NOT NULL,     ← true owner
    created_by      BIGINT,                       ← who actually created (audit)
    user_id         BIGINT,                       ← sometimes kept for convenience
    ...
    INDEX idx_account_orders (account_id, created_at DESC)
);
```

```sql
-- Super fast & secure authorization pattern
SELECT * FROM orders
WHERE id = ?
  AND account_id = ?   ← current user's account
```

→ O(1) authorization check directly in the database
→ Impossible to forget the ownership check
→ Works great with sharding (account_id → shard key)
→ Row-level security friendly

## Evolution: From single-user to multi-user / organization accounts

**Phase 1 – Simple apps**  
One user = one owner  
→ `user_id` everywhere is fine

**Phase 2 – Real growth**  
One account can have multiple users (team, family, employees, sub-accounts)

```diff
- user_id          BIGINT NOT NULL
+ account_id        BIGINT NOT NULL
+ created_by        BIGINT           -- optional: the actual user who performed action
+ updated_by        BIGINT           -- optional
```

**Recommended modern structure (2024–2026 best practice):**

```sql
-- Core ownership
account_id      BIGINT NOT NULL     -- The real owner / tenant

-- Audit trail (very useful, low cost)
created_by      BIGINT              -- user who created
created_at      TIMESTAMP
updated_by      BIGINT              -- last user who updated
updated_at      TIMESTAMP

-- Optional convenience (use carefully)
user_id         BIGINT              -- only if 95%+ cases it's same as created_by
```

## Summary – Quick Decision Table

| Entity Type               | Needs `account_id` / `tenant_id` ? | Needs `user_id` ?         | Typical Index                              |
|---------------------------|-------------------------------------|----------------------------|--------------------------------------------|
| Product, Category, Brand  | No                                  | No                         | —                                          |
| Global promotions, taxes  | No                                  | No                         | —                                          |
| Order, Payment, Refund    | **YES**                             | Optional (audit)           | (account_id, created_at)                   |
| Cart                      | **YES**                             | Optional                   | (account_id)                               |
| Address, Saved Card       | **YES**                             | Optional                   | (account_id, type, is_default)             |
| User profile              | No (but user_id is PK)              | —                          | —                                          |

## Final Advice

```text
Storage is cheap.
Latency is expensive.
Security bugs are catastrophic.

Denormalize ownership early.