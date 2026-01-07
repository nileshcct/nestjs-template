# Authentication Architecture

This project follows a **strict separation between User and Authentication concerns**.

The goal is simple:
- Users represent people
- Auth represents how those people log in

These two problems are intentionally decoupled.

---

## Core Rule

> **User does not know how authentication works.  
> Authentication does not store user business data.**

Breaking this rule is how systems become unmaintainable.

---

## High-Level Components

- User
- AuthIdentity
- AuthCredential
- AuthSession
- RefreshToken

Each component has **one responsibility** and **one reason to change**.

---

## User

The `User` entity stores **profile and domain data only**.

Examples:
- name
- age
- preferences (future)

It does NOT contain:
- email
- phone
- password
- provider info

A user can exist without any login method.

---

## AuthIdentity

`AuthIdentity` defines **how a user authenticates**.

Examples:
- Email + password
- Phone + OTP
- Google OAuth
- GitHub OAuth

Each identity:
- Belongs to exactly one user
- Uses exactly one provider

A single user can have **multiple identities**.

---

## AuthCredential (LOCAL only)

Credentials are stored **only for LOCAL provider**.

Why:
- OAuth providers don’t need passwords
- Keeps sensitive data isolated
- Allows different auth mechanisms without schema changes

Passwords never touch:
- User
- AuthIdentity

---

## AuthSession

Sessions represent **active logins**, not users.

Each login:
- Creates a new session
- Can be revoked independently
- Is linked to both user and identity

This enables:
- Logout
- Device-based revocation
- Security audits

---

## RefreshToken

Refresh tokens are:
- Stored server-side
- Linked to a session
- Rotatable

Access tokens are stateless.
Refresh tokens are stateful.

This gives control without killing performance.

---

## Why This Architecture Exists

This design avoids:
- One-table auth disasters
- Provider-specific hacks
- Rewrites when adding new login methods

It enables:
- Clean scaling
- Enterprise-grade security
- Easy provider expansion

If this feels strict — good.  
Auth should be boring.
