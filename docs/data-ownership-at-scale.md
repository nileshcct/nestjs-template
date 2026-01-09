
# Ownership, Authorization, and Why `userId` Still Exists at Scale

This README explains **why serious systems denormalize ownership**, why **`userId` (or `accountId`) is stored everywhere**, and how real-world platforms like Amazon / Flipkart / Shopify think about authorization.

No fluff. Just the rules that survive scale.

---

## 1. System-Owned vs User-Owned Data

Some resources are **catalog / system-owned**.  
Everyone can see them. Nobody “owns” them.

Examples:

- Product  
- Category  
- Brand  
- Inventory  
- Promotion  
- TaxRule  

These **do NOT need `userId`**.

If access is global, ownership is irrelevant.

---

## 2. The Moment Ownership Appears, Everything Changes

The moment a resource is **user-owned**, the database must be able to answer:

> “Does this user (or account) own this row?”

And it must answer that in **O(1)**.

Not:
- after joins  
- not after service-layer filtering  
- not after frontend validation  

**At the database level. In one query.**

---

## 3. Why Big Companies Store `userId` Everywhere

Amazon / Flipkart / Shopify logic is brutal and correct:

- Authorization must be **O(1)**
- Joins are **expensive at scale**
- Guards are **not enough**
- The **DB query itself must prove ownership**

So they **denormalize intentionally**.

### Why?
- Storage is cheap
- Latency is not
- Security bugs are catastrophic

---

## 4. “We Don’t Store userId” — What That Actually Means

If someone says _“we don’t store userId”_, they are doing one of these:

1. **Relying on joins**  
   → Slow, complex, fragile at scale  

2. **Filtering in code**  
   → Classic security bug  

3. **Trusting the frontend**  
   → Instant vulnerability  

4. **They haven’t hit scale yet**  
   → The bill always comes later  

There is no fifth option.

---

## 5. The Golden Rule (Read This Twice)

> **If a resource is user-owned, the database must be able to prove ownership directly.**

That means:

- `userId`
- OR something that deterministically resolves to it
- **In ONE query**

No joins. No guessing. No assumptions.

---

## 6. What Must Always Have Ownership

These are **not optional**:

Add `userId` (or equivalent) to:

- orders
- payments
- carts
- addresses

Even if you *think* you don’t need it today.

You will.

---

## 7. When One Company Has Multiple Users

This is where most systems grow up.

Once a user can invite another user:

`userId` is no longer the owner  
 The owner becomes an **account / organization / tenant**

### The real model:

- One **account** → many users
- One **account** → all business data

Users act **on behalf of** the account.

---

## 8. Correct Ownership Model

```ts
Order {
  _id
  accountId   // REAL ownership (required)
  createdBy   // userId (optional, audit only)
}
````

### Why this works

* Authorization checks use `accountId`
* Multi-user access is natural
* Auditing still knows *who* acted
* Queries stay fast
* Security stays boring (that’s good)

---

## 9. Conclusion
* `userId` is **not about relationships**
* It is about **authorization**
* Ownership must be **provable at the database level**
* Denormalization is not bad design — **it’s survival**

If your DB cannot prove ownership in one query,
your system is already broken — it just doesn’t know it yet.
