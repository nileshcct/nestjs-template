```markdown
# User Model Architecture (NestJS + Mongoose)

## Structure Overview

This project uses a layered approach for the `User` model, suitable for large production-grade applications:

- **user.schema.ts**: Mongoose schema and document definition (database layer).
- **dto/create-user.dto.ts** & **update-user.dto.ts**: Input validation for API requests.
- **entities/user.entity.ts**: Clean domain/response object returned to clients (excludes sensitive fields like password).
- **user.mapper.ts**: Converts Mongoose documents to `UserEntity` (handles _id → id, hides internals).

## Why This Approach?
- Ensures sensitive fields (password, __v) are never exposed.
- Provides consistent, clean API responses.
- Separates concerns: database, input validation, and output shape.
- Improves security, testability, and maintainability.
- Aligns with Clean Architecture/DDD principles used in large-scale NestJS apps.

## Adding New Fields
Requires updates in:
1. Schema (add @Prop)
2. CreateUserDto (if sent on create)
3. UserEntity (for response)
4. UserMapper (mapping logic)

This explicitness ensures control and safety in large codebases.
For large production apps, the current layered structure with entity + mapper is recommended.
```