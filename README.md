```
================================================================================
  CODESTRIKE — HOSPITAL MANAGEMENT SYSTEM
  README
```

```
================================================================================
```

## `PROJECT OVERVIEW` 

```
----------------
Hospital Management System is a full-stack web application built by team
CodeStrike for managing core hospital operations including patient records,
appointments, admissions, billing, treatments, and staff coordination.
```

```
  Backend  : Java 21 + Spring Boot 3 + Spring Security 6
  Frontend : Vanilla HTML / CSS / JavaScript (Single Page Application)
  Database : MySQL 8.0
  Build    : Apache Maven 3.9
```

```
--------------------------------------------------------------------------------
TEAM
```

```
--------------------------------------------------------------------------------
  Team Name : CodeStrike
```

```
  Project   : Hospital Management System (hospitalz)
```

```
--------------------------------------------------------------------------------
FEATURES
```

```
--------------------------------------------------------------------------------
```

- `JWT-based stateless authentication with role-based access control` 

- `BCrypt password hashing (strength 10)` 

- `Remember Me session (24h standard / 30-day persistent)` 

- `Patient management (register, view, update records)` 

- `Doctor management and doctor-patient assignment` 

- `Appointment scheduling and status tracking` 

- `Room management (assign, discharge, track availability)` 

- `Admission management with discharge workflow` 

- `Treatment and treatment record tracking` 

- `Billing and payment management` 

- `Vitals log monitoring (blood pressure, temperature, pulse, SpO2)` 

- `Staff management (Nurse, Ward Boy) with shift and ward assignment` 

- `Transport task coordination` 

- `Admin dashboard with system-wide statistics` 

- `Change password functionality` 

```
--------------------------------------------------------------------------------
ROLES & PERMISSIONS
```

```
--------------------------------------------------------------------------------
  ADMIN      Full access — manage users, staff, rooms, all records
  DOCTOR     View/manage own patients, appointments, treatments
  NURSE      Record vitals, manage assigned ward patients
  WARD_BOY   Handle transport tasks
  PATIENT    View own appointments, records, bills
```

```
--------------------------------------------------------------------------------
TECH STACK
```

```
--------------------------------------------------------------------------------
  Layer         Technology
```

```
  ------------  -----------------------------------
```

```
  Backend       Java 21, Spring Boot 3
  Security      Spring Security 6, JWT (HS256), BCrypt
  ORM           Spring Data JPA, Hibernate
  Database      MySQL 8.0
  Build Tool    Apache Maven 3.9
```

```
  Frontend      HTML5, CSS3, Vanilla JavaScript
  JWT Library   io.jsonwebtoken (jjwt)
```

```
--------------------------------------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------------------------------------
  hospitalz/
  ├── src/main/java/cswebapp/hospitalz/
  │   ├── config/
  │   │   ├── JwtAuthenticationFilter.java   # OncePerRequestFilter — validates
JWT
  │   │   ├── JwtService.java                # Generate & parse JWT (HS256)
  │   │   └── SecurityConfig.java            # Filter chain, CSRF off, Stateless
  │   ├── controller/
  │   │   ├── AuthController.java            # POST /api/v1/auth/login &
/register
  │   │   ├── AdminController.java
  │   │   ├── PatientController.java
  │   │   ├── DoctorController.java
  │   │   ├── AppointmentController.java
  │   │   ├── AdmissionController.java
  │   │   ├── RoomController.java
  │   │   ├── BillController.java
  │   │   ├── TreatmentController.java
  │   │   ├── TreatmentRecordController.java
  │   │   ├── VitalsLogController.java
  │   │   ├── StaffController.java
  │   │   ├── TransportTaskController.java
  │   │   ├── UserController.java
  │   │   └── HomeController.java
  │   ├── model/                             # JPA Entities
  │   ├── repository/                        # Spring Data JPA Repositories
  │   └── dto/                               # LoginRequest, RegisterRequest,
etc.
  ├── src/main/resources/
  │   ├── application.properties
  │   └── static/                            # Frontend (HTML, CSS, JS)
  └── database/
      └── schema.sql                         # Full MySQL schema dump
--------------------------------------------------------------------------------
API ENDPOINTS (KEY ROUTES)
--------------------------------------------------------------------------------
  Auth
    POST   /api/v1/auth/login                Public
    POST   /api/v1/auth/register             Public
  Patients
    GET    /api/v1/patients                  Authenticated
    POST   /api/v1/patients                  Authenticated
    GET    /api/v1/patients/{id}             Authenticated
  Appointments
    GET    /api/v1/appointments              Authenticated
    POST   /api/v1/appointments              Authenticated
  Admissions
    GET    /api/v1/admissions                Authenticated
    POST   /api/v1/admissions                Authenticated
  Vitals
    GET    /api/v1/vitals                    Authenticated
```

```
    POST   /api/v1/vitals                    Authenticated
  Billing
    GET    /api/v1/bills                     Authenticated
  Admin
    GET    /api/v1/admin/**                  ADMIN only
    GET    /api/v1/users/**                  ADMIN only
    GET    /api/v1/staff/**                  ADMIN only
```

```
--------------------------------------------------------------------------------
SECURITY DESIGN
```

```
--------------------------------------------------------------------------------
  Authentication : JWT Bearer Token (Authorization header)
  Algorithm      : HS256 with 256-bit secret key
  Session Policy : STATELESS (no server-side session)
  CSRF           : Disabled (Bearer token not vulnerable to CSRF)
  Password       : BCryptPasswordEncoder (strength 10)
```

```
  Token Lifetime:
    Standard   — 24 hours  (86,400,000 ms)
    Remember Me — 30 days  (2,592,000,000 ms)
```

```
  Filter Flow:
    Request → JwtAuthenticationFilter
      → No token    : forward (Spring Security enforces rules)
      → Valid token : set SecurityContextHolder → forward to Controller
      → Invalid/Expired : silently skip → Spring Security returns 401/403
```

```
--------------------------------------------------------------------------------
DATABASE SETUP
```

```
--------------------------------------------------------------------------------
```

`1. Create a MySQL database: CREATE DATABASE hospital_db;` 

`2. Import the schema:` 

```
       mysql -u root -p hospital_db < hospitalz/database/schema.sql
```

```
  3. Configure connection in application.properties (or via environment vars):
       DB_URL      = jdbc:mysql://<host>:<port>/hospital_db?serverTimezone=UTC
       DB_USERNAME = <your_username>
       DB_PASSWORD = <your_password>
       JWT_SECRET  = <your_256bit_base64_secret>
```

```
--------------------------------------------------------------------------------
HOW TO RUN
--------------------------------------------------------------------------------
  Prerequisites:
    - Java 21+
    - Maven 3.9+
    - MySQL 8.0+
```

```
  Steps:
```

```
    1. Clone the repository:
         git clone https://github.com/CodeStrike/CodeStrike-
Hospital_Management.git
```

`2. Set up the database (see DATABASE SETUP above).` 

`3. Navigate to the project folder: cd hospitalz` 

`4. Build and run:` 

`5. Open browser at:` 

```
  The application serves the frontend from /src/main/resources/static/.
  Navigate to /auth.html to log in.
```

```
--------------------------------------------------------------------------------
```

## `ENVIRONMENT VARIABLES` 

```
--------------------------------------------------------------------------------
  Variable       Default                              Description
```

```
  -----------    ---------------------------------    --------------------------
  DB_URL         jdbc:mysql://localhost:3306/...      MySQL connection URL
  DB_USERNAME    root                                 Database username
  DB_PASSWORD    NfbJikjeVwYPaDdRcOqGvvVSLLVoKAPS     Database password
  JWT_SECRET     404E635266...                        Base64-encoded HS256 key
```

```
  WARNING: Change JWT_SECRET and DB_PASSWORD before deploying to production.
```

```
--------------------------------------------------------------------------------
```

## `NOTES` 

```
--------------------------------------------------------------------------------
```

- `The application is configured with spring.jpa.hibernate.ddl-auto=update, which auto-updates the schema on startup. Switch to "validate" or "none" in production.` 

- `Default deployed database is hosted on Railway (see application.properties). Replace with your own MySQL instance for local development.` 

```
================================================================================
```

