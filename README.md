<div align="center">

# 🏥 Hospital Management System
### CodeStrike Team

*A full-stack hospital operations platform with role-based access control, built with Spring Boot 3 and vanilla JavaScript.*

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Roles & Permissions](#-roles--permissions)
- [Security Design](#-security-design)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)

---

## Overview

**Hospital Management System** is a full-stack web application developed by team **CodeStrike** to digitize and streamline core hospital workflows — from patient registration and appointment scheduling to billing, treatment tracking, and real-time vitals monitoring.

| Layer | Technology |
|-------|-----------|
| Backend | Java 21 + Spring Boot 3 |
| Security | Spring Security 6 + JWT (HS256) + BCrypt |
| Frontend | Vanilla HTML / CSS / JavaScript (SPA) |
| Database | MySQL 8.0 |
| Build | Apache Maven 3.9 |

---

## Features

### Authentication & Security
- JWT stateless authentication with role-based access control
- BCrypt password hashing (strength factor 10)
- Remember Me session: 24-hour standard / 30-day persistent
- Tamper-proof tokens — HS256 signature invalidates any payload modification

### User & Staff Management
- Multi-role user system (Admin, Doctor, Nurse, Ward Boy, Patient)
- Staff scheduling with shift and ward assignment
- Secure password change endpoint

### Clinical Operations
- Patient registration, records, and status tracking
- Doctor–patient assignment workflow
- Appointment scheduling with status management
- Room management — assign, transfer, discharge
- Admission and discharge workflow
- Treatment plans and treatment record logging
- Vitals monitoring: blood pressure, temperature, pulse, SpO₂

### Administrative
- Billing and payment management
- Transport task coordination (Ward Boy)
- Admin dashboard with system-wide statistics

---

## Tech Stack

```
Backend     │ Java 21, Spring Boot 3, Spring Data JPA, Hibernate
Security    │ Spring Security 6, JWT (io.jsonwebtoken / jjwt), BCryptPasswordEncoder
Database    │ MySQL 8.0
Frontend    │ HTML5, CSS3, Vanilla JavaScript (SPA, no framework)
Build       │ Apache Maven 3.9
Deployment  │ Railway (cloud MySQL)
```

---

## Project Structure

```
hospitalz/
├── src/main/java/cswebapp/hospitalz/
│   ├── config/
│   │   ├── JwtAuthenticationFilter.java   # OncePerRequestFilter — validates JWT
│   │   ├── JwtService.java                # Token generation & parsing (HS256)
│   │   └── SecurityConfig.java            # Filter chain, CSRF off, STATELESS
│   │
│   ├── controller/
│   │   ├── AuthController.java            # POST /api/v1/auth/login & /register
│   │   ├── AdminController.java
│   │   ├── PatientController.java
│   │   ├── DoctorController.java
│   │   ├── DoctorPatientController.java
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
│   │
│   ├── model/                             # JPA Entities (Patient, Doctor, Room...)
│   ├── repository/                        # Spring Data JPA Repositories
│   └── dto/                              # LoginRequest, RegisterRequest...
│
├── src/main/resources/
│   ├── application.properties
│   └── static/                           # Frontend (HTML, CSS, JS)
│
└── database/
    └── schema.sql                        # Full MySQL schema dump
```

---

## Roles & Permissions

| Role | Access Level |
|------|-------------|
| `ADMIN` | Full access — users, staff, rooms, all records, dashboard |
| `DOCTOR` | Own patients, appointments, treatments, treatment records |
| `NURSE` | Vitals recording, assigned ward patient management |
| `WARD_BOY` | Transport task management |
| `PATIENT` | Own appointments, records, bills |

---

## Security Design

### Authentication Flow

```
POST /api/v1/auth/login
  → findByUsername()          # Query users table
  → passwordEncoder.matches() # BCrypt verify
  → isActive() check          # Account lock check
  → jwtService.generateToken()# Issue HS256 JWT
  → Return { token, role, username, profileId }
```

### Request Filter Flow

```
Incoming Request
  → JwtAuthenticationFilter (OncePerRequestFilter)
      ├─ No Bearer token   → chain.doFilter() [Spring Security enforces rules]
      ├─ Valid token       → set SecurityContextHolder → chain.doFilter() → Controller
      └─ Invalid/Expired   → catch silently → chain.doFilter() → Spring Security 401/403
```

### Token Configuration

| Type | Lifetime | Storage |
|------|----------|---------|
| Standard | 24 hours (86,400,000 ms) | `sessionStorage` |
| Remember Me | 30 days (2,592,000,000 ms) | `localStorage` |

### Security Highlights
- **Stateless** — `SessionCreationPolicy.STATELESS`, no server-side session
- **CSRF disabled** — Bearer tokens in `Authorization` header are not CSRF-vulnerable
- **Tamper detection** — Any modification to JWT payload invalidates HS256 signature
- **Safe error handling** — Expired/malformed tokens caught silently, no stack trace exposed
- **Password hashing** — BCrypt with salt round factor 10, never stored in plain text

---

## 🌐 API Endpoints

### Public
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
```

### Authenticated (any valid role)
```
GET    /api/v1/patients
POST   /api/v1/patients
GET    /api/v1/patients/{id}
GET    /api/v1/appointments
POST   /api/v1/appointments
GET    /api/v1/admissions
POST   /api/v1/admissions
GET    /api/v1/vitals
POST   /api/v1/vitals
GET    /api/v1/bills
GET    /api/v1/rooms
GET    /api/v1/treatments
GET    /api/v1/doctors
PATCH  /api/v1/users/me/password
```

### Admin Only
```
GET    /api/v1/admin/**
GET    /api/v1/users/**
GET    /api/v1/staff/**
```

---

## Getting Started

### Prerequisites

- Java 21+
- Maven 3.9+
- MySQL 8.0+

### 1. Clone the repository

```bash
git clone https://github.com/CodeStrike/CodeStrike-Hospital_Management.git
cd CodeStrike-Hospital_Management/hospitalz
```

### 2. Set up the database

```sql
CREATE DATABASE hospital_db;
```

```bash
mysql -u root -p hospital_db < database/schema.sql
```

### 3. Configure environment

Copy and edit your local config:

```bash
cp src/main/resources/application.properties src/main/resources/application-local.properties
```

Set your values:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_db?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_password
jwt.secret=your_256bit_base64_secret
```

### 4. Run the application

```bash
./mvnw spring-boot:run
```

### 5. Open in browser

```
http://localhost:8080/auth.html
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_URL` | `jdbc:mysql://localhost:3306/hospital_db` | MySQL connection URL |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | *(none)* | Database password |
| `JWT_SECRET` | `404E6352...` | Base64-encoded HS256 key |

> ⚠️ **Important:** Always override `JWT_SECRET` and `DB_PASSWORD` with strong values before deploying to production. Never commit `.env` or `application-local.properties` to version control.

---

> **Note:** `spring.jpa.hibernate.ddl-auto` is set to `update` for development convenience. Switch to `validate` or `none` in production to prevent unintended schema changes.

