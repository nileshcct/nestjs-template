# Authentication Architecture

This project follows a **strict separation between User and Authentication concerns**.

The goal is simple:

* Users represent people
* Auth represents how those people log in

These two problems are intentionally decoupled.

---

## Core Rule

> **User does not know how authentication works.
> Authentication does not store user business data.**

Breaking this rule is how systems become unmaintainable.

---

## High-Level Components

* User
* AuthIdentity
* AuthCredential
* AuthSession
* RefreshToken
* AuthVerificationToken

Each component has **one responsibility** and **one reason to change**.

---

## User

The `User` entity stores **profile and domain data only**.

Examples:

* name
* age
* preferences (future)

It does NOT contain:

* email
* phone
* password
* provider info

A user can exist **without any login method**.

---

## AuthIdentity

`AuthIdentity` defines **how a user authenticates**.

Examples:

* Email + password
* Phone + OTP
* Google OAuth
* GitHub OAuth

Each identity:

* Belongs to exactly one user
* Uses exactly one provider

A single user can have **multiple identities**.

---

## AuthCredential (LOCAL only)

Credentials exist **only for LOCAL providers**.

Why:

* OAuth providers manage secrets themselves
* Sensitive data stays isolated
* New auth mechanisms don’t require schema changes

Passwords never touch:

* User
* AuthIdentity

---

## AuthSession

Sessions represent **active logins**, not users.

Each login:

* Creates a new session
* Can be revoked independently
* Is linked to both user and identity

This enables:

* Logout
* Device-based revocation
* Session-level security audits

---

## RefreshToken

Refresh tokens are:

* Stored server-side
* Linked to a session
* Rotatable and revocable

Access tokens are stateless.
Refresh tokens are stateful.

This provides control **without sacrificing performance**.

---

## AuthVerificationToken

`AuthVerificationToken` exists to **prove ownership of an identity**, not to authenticate access.

It is used for **one-time verification workflows**, such as:

* Email verification
* Phone number verification
* Password reset
* Sensitive identity changes

This entity is **deliberately separate** from sessions and credentials.

---

### What It Is (and Is Not)

**It is:**

* Short-lived
* Single-purpose
* Bound to an `AuthIdentity`
* Expirable and revocable

**It is NOT:**

* A login session
* A refresh token
* A credential
* A long-lived state

Verification is a step — not a state.

---

### Responsibilities

Each `AuthVerificationToken`:

* Belongs to exactly one `AuthIdentity`
* Has exactly one purpose (verify email, verify phone, reset password, etc.)
* Expires automatically
* Is invalidated after successful use

One token. One action. One outcome.

---

### Example Flows

#### Email / Phone Verification

1. User creates an `AuthIdentity`
2. System issues an `AuthVerificationToken`
3. User proves ownership (OTP / link)
4. Identity is marked as verified
5. Token is destroyed

#### Password Reset

1. User requests password reset
2. Verification token is issued
3. Token is validated once
4. Credential is updated
5. Token is destroyed

No sessions are created until verification succeeds.

---

## Why This Architecture Exists

This design avoids:

* One-table auth disasters
* Provider-specific hacks
* Schema rewrites when adding login methods
* Security logic bleeding into domain models

It enables:

* Clean scaling
* Enterprise-grade security
* Multiple auth providers per user
* Auditable authentication flows

---

## Core Rule (Extended)

> **Verification proves ownership.
> Authentication grants access.
> Sessions maintain access.**

Mix these concerns and security degrades fast.

---

## Summary

This architecture cleanly separates:

* **Who the user is** → `User`
* **How they authenticate** → `AuthIdentity`
* **Secret material** → `AuthCredential`
* **Active access** → `AuthSession`
* **Long-lived access** → `RefreshToken`
* **Ownership proof** → `AuthVerificationToken`

If this feels strict — good.

Auth should be boring, predictable, and hard to mess up.
