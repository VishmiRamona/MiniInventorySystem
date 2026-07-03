# Technical Explanation

## Architecture Overview

This project follows **Clean Architecture** principles to separate concerns and make the code maintainable, testable, and scalable.

---

## Why Clean Architecture?

Clean Architecture ensures the core business logic is independent of external frameworks like databases or web APIs. This makes the system flexible and easy to modify.

| Layer | Project | Responsibility |
| :--- | :--- | :--- |
| **Domain** | MiniInventory.Domain | Core business entities (Category, Item, Stock, User) |
| **Application** | MiniInventory.Application | DTOs, business services, interfaces |
| **Infrastructure** | MiniInventory.Infrastructure | Database access, repositories |
| **API** | MiniInventory.API | Controllers, endpoints |
| **Shared** | MiniInventory.Shared | Common responses, error handling |

---

## Why Repository Pattern?

The Repository Pattern acts as a mediator between the application and the database:

- **Decoupling:** The application doesn't depend on Entity Framework directly.
- **Testability:** Repositories can be mocked for unit testing.
- **Maintainability:** If we switch databases (e.g., from SQL Server to PostgreSQL), only the infrastructure layer changes.

---

## Why Services?

Services contain the business logic:

- **Separation of Concerns:** Controllers only handle HTTP requests/responses.
- **Reusability:** The same service can be used by multiple controllers.
- **Transaction Management:** Services handle complex operations like stock balance calculations.

---

## Why DTOs?

DTOs (Data Transfer Objects) control what data is sent to the frontend:

- **Security:** Sensitive fields (like passwords) are excluded.
- **Performance:** Only necessary fields are transmitted.
- **Flexibility:** The backend can change without breaking the frontend.

---

## Why FluentValidation?

FluentValidation provides clean, readable validation rules:

- **Clean Validation Logic:** Rules are written in a fluent, human-readable style.
- **Separation:** Validation logic stays in the Application layer.
- **Reusability:** Validators can be used across multiple endpoints.

---

## Why ASP.NET Core + React?

- **ASP.NET Core:** High performance, cross-platform, built-in dependency injection.
- **React:** Component-based architecture, reactive UI, large ecosystem.
- **Tailwind CSS:** Rapid UI development with utility-first classes.

---

## Why Entity Framework Core?

- **Productivity:** LINQ queries are easy to write and understand.
- **Migrations:** Database schema changes are version-controlled.
- **Relationships:** EF Core handles foreign keys and navigation properties automatically.

---

## Conclusion

This architecture ensures the system is:

- **Maintainable:** Each layer has a single responsibility.
- **Testable:** Layers are independent and can be mocked.
- **Scalable:** New features can be added without breaking existing code.
- **Secure:** Data exposure is controlled via DTOs.
- **Professional:** Follows industry best practices for enterprise applications.