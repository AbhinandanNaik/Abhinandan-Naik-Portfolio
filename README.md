# Abhinandan Naik — Portfolio Platform

An enterprise-grade, high-performance personal portfolio website for a Software Engineer & Systems Architect. This project is structured as a decoupled, multi-tier application.

## 🚀 Architecture Overview

The platform consists of:
- **Frontend**: A Next.js 15 App Router client styled with Tailwind CSS, running React 19 and Three.js / React Three Fiber for dynamic 3D visuals.
- **Backend**: A Java 21 & Spring Boot 3.5 REST API managing authentication (JWT), telemetry logs, AI assistant fallbacks, and CRUD operations.
- **Database**: PostgreSQL relational storage. Supports asynchronous database logging with programmatic exclusions to prevent circular JDBC queries.
- **Telemetry**: Actuator scraper mappings observing Hikari connection pools and garbage collection metrics.

## 📁 Repository Structure

```text
├── frontend/             # Next.js 15 Client & 3D Interactive UI
├── backend/              # Spring Boot 3.5 Java Backend & REST APIs
├── infrastructure/       # Nginx configs, Dockerfiles, and compose profiles
└── docs/                 # System architectural, API, and DB documentation
```

## 🛠️ Local Development Quickstart

### Prerequisites
* Java 21 JDK
* Maven 3.8+
* Node.js 20+

### Run Backend
1. Navigate to `backend/` and configure database properties in `src/main/resources/application-local.yml` (configured to H2 in-memory by default).
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080/api`.

### Run Frontend
1. Navigate to `frontend/` and install dependencies:
   ```bash
   npm install
   ```
2. Launch the developer server:
   ```bash
   npm run dev
   ```
   The frontend UI will start on `http://localhost:3000`.

## 🌐 Production Deployment

The project is built for containerized or edge setups:
* **Frontend**: Optimize for [Vercel](https://vercel.com/) or similar edge CDN platforms.
* **Backend**: Deploy as a container using `infrastructure/Dockerfile.backend` on platforms like [Render](https://render.com/) or AWS.
* **Database**: Designed for serverless PostgreSQL databases like [Neon](https://neon.tech/) with PgBouncer connection pooling.

For step-by-step production hosting guidelines, check out the [Deployment Guide](docs/deployment_guide.md).
