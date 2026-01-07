## Database Schema

This application uses a **normalized schema** designed for scalability, security, and multi-provider authentication.

Each collection has **one responsibility** and clear relationships.

---

### Users

Stores **profile and domain data only**.

```ts
User {
  _id: ObjectId
  name: string
  age?: number
  createdAt
  updatedAt
}
