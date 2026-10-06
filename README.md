\# PetroLogistics



PetroLogistics is a full-stack logistics and shipment management system designed for the petrochemical industry.



The project demonstrates a practical implementation of a modern web application using ASP.NET Core Web API, React, Entity Framework Core, SQL Server, JWT authentication, role-based authorization, audit trails, dashboard analytics, and structured logging.



\## Tech Stack



\### Backend

\- ASP.NET Core Web API (.NET 10)

\- C#

\- Entity Framework Core

\- SQL Server

\- ASP.NET Core Identity

\- JWT Authentication

\- Role-Based Authorization

\- Swagger / OpenAPI

\- ILogger



\### Frontend

\- React.js

\- Vite

\- JavaScript

\- Bootstrap

\- Axios

\- React Router

\- Chart.js

\- react-chartjs-2



\## Architecture



The backend follows a service-based layered architecture:



```text

Controller

&#x20;   ↓

Service Interface

&#x20;   ↓

Service

&#x20;   ↓

Entity Framework Core

&#x20;   ↓

SQL Server

```



DTOs are used between the API layer and business logic to avoid exposing database entities directly.



The application also includes centralized exception handling and structured logging.



\## Main Features



\### Authentication \& Authorization



\- JWT-based authentication

\- ASP.NET Core Identity

\- Admin and Operator roles

\- Protected backend endpoints

\- Protected React routes

\- Automatic JWT attachment using Axios interceptors

\- Automatic logout when authentication expires

\- Role-based navigation and UI access



\### Customer Management



Admin users can:



\- View customers

\- Create customers

\- Update customers

\- Delete customers



Operators have read access where customer information is required for shipment operations.



\### Product Management



Admin users can:



\- View products

\- Create products

\- Update products

\- Delete products



Products include:



\- Product name

\- Product code

\- Category

\- Unit

\- Hazardous-material flag

\- Active/inactive status



Operators have read access where product information is required for shipment operations.



\### Shipment Management



The application supports:



\- Creating shipments

\- Updating shipments

\- Cancelling shipments

\- Viewing shipment details

\- Searching shipments

\- Filtering shipments

\- Pagination

\- Shipment status tracking



Each shipment includes information such as:



\- Shipment number

\- Customer

\- Product

\- Quantity

\- Origin

\- Destination

\- Shipment date

\- Status

\- Created date

\- Updated date



\## Shipment Workflow



Supported statuses:



```text

Pending

InTransit

Delivered

Cancelled

```



Allowed transitions include:



```text

Pending

├── InTransit

└── Cancelled



InTransit

├── Delivered

└── Cancelled

```



Delivered and Cancelled shipments cannot be modified.



The backend validates shipment transitions to protect business rules even if a client attempts to bypass the frontend.



\## Business Rules



Examples of implemented business rules:



\- Shipment numbers must be unique.

\- Product codes must be unique.

\- Shipment quantity must be greater than zero.

\- Customer must exist before creating a shipment.

\- Product must exist before creating a shipment.

\- Inactive products cannot be used for shipments.

\- Invalid shipment status transitions are rejected.

\- Delivered shipments cannot be modified or cancelled.

\- Cancelled shipments cannot be modified.

\- Shipment status history is automatically recorded.



\## Audit Trail



Shipment status changes are recorded in the database.



The audit trail stores:



\- Shipment status

\- Date and time of the change

\- User who performed the action



The user identity is obtained from the authenticated JWT rather than being supplied by the frontend.



Example:



```text

Pending     operator@petrologistics.com

InTransit   operator@petrologistics.com

Delivered   admin@petrologistics.com

```



\## Dashboard \& Analytics



The application contains a dashboard with shipment analytics including:



\- Shipment statistics

\- Shipments by status

\- Shipments by month

\- Top destinations

\- Top products

\- Recent shipments



Charts are displayed in React using Chart.js.



\## Search \& Pagination



Shipment search supports filtering by:



\- Status

\- Customer

\- Product

\- Origin

\- Destination

\- Date range



Results are paginated on the backend.



\## Error Handling



The API uses centralized global exception handling.



Business exceptions are converted into appropriate HTTP responses such as:



```text

400 Bad Request

404 Not Found

409 Conflict

500 Internal Server Error

```



This keeps controllers clean and provides consistent API responses.



\## Logging



ASP.NET Core `ILogger` is used for structured application logging.



Important operations are logged, including:



\- Shipment creation

\- Shipment status changes

\- Shipment cancellation



Example:



```text

Shipment SHP-2026-0013 created successfully by operator@petrologistics.com.

```



Audit Trail and application logging have separate responsibilities:



\- Audit Trail stores business history in the database.

\- ILogger provides technical/application diagnostic information.



\## Secure Configuration



Sensitive development configuration is not stored directly in source control.



ASP.NET Core User Secrets are used during development for values such as:



```text

Database connection credentials

JWT signing key

```



Non-sensitive settings remain in `appsettings.json`.



Production secrets should be supplied through environment variables or an appropriate secret-management solution.



\## Project Structure



```text

PetroLogistics/

│

├── client/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   └── services/

│   ├── package.json

│   └── ...

│

├── server/

│   └── PetroLogistics.API/

│       ├── Controllers/

│       ├── Data/

│       ├── DTOs/

│       ├── Exceptions/

│       ├── Models/

│       ├── Services/

│       ├── Migrations/

│       ├── Program.cs

│       └── appsettings.json

│

├── .gitignore

└── README.md

```



\## Running the Backend



\### Requirements



\- .NET 10 SDK

\- SQL Server

\- Visual Studio 2022 or another compatible IDE



Navigate to the API project and restore dependencies:



```bash

dotnet restore

```



Configure the development secrets using ASP.NET Core User Secrets.



Example:



```bash

dotnet user-secrets set "ConnectionStrings:DefaultConnection" "YOUR\_CONNECTION\_STRING"

```



```bash

dotnet user-secrets set "Jwt:Key" "YOUR\_SECURE\_JWT\_KEY"

```



Apply the database migrations:



```bash

dotnet ef database update

```



Run the API:



```bash

dotnet run

```



Swagger is available when the API runs in the Development environment.



\## Running the Frontend



\### Requirements



\- Node.js

\- npm



Navigate to:



```text

client

```



Install dependencies:



```bash

npm install

```



Run the Vite development server:



```bash

npm run dev

```



\## API Overview



Main API areas include:



```text

/api/Auth

/api/Customers

/api/Products

/api/Shipments

/api/Dashboard

```



Authentication endpoints provide JWT tokens that are used to access protected resources.



\## Roles



\### Admin



Admin users can manage:



\- Customers

\- Products

\- Shipments

\- Dashboard

\- User registration



\### Operator



Operator users can:



\- Work with shipments

\- View required customer information

\- View required product information

\- Access dashboard information



Administrative customer and product modifications remain restricted to Admin users.



\## Security



The project demonstrates:



\- Password hashing through ASP.NET Core Identity

\- JWT authentication

\- Role-based authorization

\- Protected API endpoints

\- Server-side business validation

\- Secure development configuration

\- User identity extraction from authenticated JWT claims



\## Future Improvements



Potential future improvements include:



\- Docker deployment

\- Cloud deployment

\- Refresh tokens

\- Automated unit/integration tests

\- CI/CD pipeline

\- Production monitoring

\- More advanced reporting



\## Purpose



This project was developed as a portfolio project to demonstrate practical full-stack development skills with a strong focus on backend development, API design, authentication, authorization, database design, business rules, and maintainable application architecture.

