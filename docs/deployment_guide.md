# Production Deployment Guide - Enterprise Cloud Architecture

This guide describes how to deploy the decoupled, enterprise-grade Portfolio platform. The recommended architecture leverages specialized cloud providers to achieve maximum performance, global availability, and high observability:

1. **Frontend Hosting**: Vercel (Edge-rendered Next.js with global CDN caching).
2. **Backend API Hosting**: Render (Dockerized Spring Boot container with Auto-scaling and Health check probes).
3. **Database Hosting**: Neon (Serverless PostgreSQL with connection pooling and database branching).
4. **Cache Layer**: Redis (Managed caching to achieve sub-15ms response latency).

---

## 1. Neon Serverless PostgreSQL Database Setup

Neon is a serverless Postgres database designed for dynamic workloads. It scales compute resources to zero when inactive and supports database branching (perfect for running dev/staging/prod pipelines).

### A. Database Provisioning
1. Sign up on [Neon Console](https://console.neon.tech/) and create a new project.
2. Under **Database**, create a database named `portfolio`.
3. Locate your connection details. Neon provides a regular connection string and a pooled connection string (using PgBouncer).
4. **IMPORTANT**: Always use the **Pooled connection string** (ends with `-pooler` suffix) for Spring Boot. This routes traffic through PgBouncer in transaction mode to prevent database driver thread exhaustion under high traffic.

### B. PgBouncer Compatibility parameters
Because PgBouncer in transaction mode multiplexes server connections, JDBC prepared statement caching must be disabled on the client side to avoid connection errors:
- Append `?sslmode=require&prepareThreshold=0` to your PostgreSQL database URL.
- **Example connection URL**: 
  `jdbc:postgresql://ep-shiny-feather-a5xxxx-pooler.us-east-2.aws.neon.tech/portfolio?sslmode=require&prepareThreshold=0`

### C. Database Branching (CI/CD Integration)
Neon supports instant copy-on-write branching. You can automate your GitHub Actions to spin up a dynamic DB branch for feature testing before merging PRs:
```bash
# Example using Neon CLI in your deployment action:
neon branches create --project-id <project-id> --name pr-branch
```

---

## 2. Render Backend (Spring Boot API) Deployment

Render runs containerized apps using the `infrastructure/Dockerfile.backend` file.

### A. Deployment Steps
1. Create a new **Web Service** on Render.
2. Link your GitHub repository.
3. Configure the service settings:
   - **Environment**: `Docker`
   - **Docker Path**: `infrastructure/Dockerfile.backend`
   - **Docker Context**: `.` (Root directory of the repo)
   - **Instance Type**: Starter (Recommended to avoid the 50-second cold start latency of the Free tier).
4. Define the Environment Variables:
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://<neon-pooler-url>/portfolio?sslmode=require&prepareThreshold=0`
   - `SPRING_DATASOURCE_USERNAME`: `<neon-db-user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<neon-db-password>`
   - `JWT_SECRET`: `<secure-random-64-char-hex-string>`
   - `OPENAI_API_KEY`: `<your-openai-api-key>` (Optional; ignored by default for fallback chatbot matcher)
   - *Note: Redis is not required as caching automatically runs in memory (`spring.cache.type: simple`)*
5. Set up **Health Check Path** (highly recommended for zero-downtime rolling updates):
   - Health Path: `/api/actuator/health`


---

## 3. Vercel Frontend (Next.js 15) Deployment

Vercel provides first-class Next.js compilation, edge middleware, global CDN, and static file optimization.

### A. Deployment Steps
1. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your repository.
3. Configure project details:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
4. Add the following **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: `https://your-render-backend-url.onrender.com/api`
5. Click **Deploy**. Vercel will build the frontend, optimize CSS/JS bundles, compile static layouts, and attach a secure SSL domain.

---

## 4. Asynchronous Database Logging & Audit

The Spring Boot backend captures application events in memory and writes them asynchronously to Neon PostgreSQL.

### A. Loop Mitigation & Resiliency
Writing database logs back into a database can trigger an infinite self-logging loop. The custom appender (`DbLogAppender`) is programmatically hardened to automatically drop events originating from:
- `org.hibernate`
- `org.springframework.jdbc`
- `org.springframework.transaction`
- `com.zaxxer.hikari`
- `org.postgresql`
- `org.flywaydb`
- `DbLogProcessor` and `LogQueue`

### B. Querying System Logs
You can query logs from the Neon Query Console or Admin panel:
```sql
-- View recent warnings or error logs
SELECT * FROM system_logs 
WHERE level IN ('WARN', 'ERROR') 
ORDER BY created_at DESC 
LIMIT 50;

-- Analyze logs frequency by logger origin
SELECT logger, count(*) as log_count 
FROM system_logs 
GROUP BY logger 
ORDER BY log_count DESC;
```

---

## 5. Alternative: On-Premises / IaaS Docker Orchestration

For hosting on an independent virtual machine (e.g., AWS EC2, DigitalOcean Droplet), you can orchestrate containers locally via Docker Compose.

1. Ensure the VM has Docker (v24.0+) and Docker Compose (v2.20+) installed.
2. Retrieve SSL Certificates using Certbot (Let's Encrypt):
   ```bash
   sudo certbot certonly --standalone -d abhinandannaik.com -d www.abhinandannaik.com
   ```
3. Set up variables in `infrastructure/.env`:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   POSTGRES_PASSWORD=generate_a_secure_postgres_passphrase_here
   JWT_SECRET=generate_a_secure_jwt_secret_here
   ```
4. Boot the stack from the `infrastructure/` directory:
   ```bash
   docker-compose up -d --build
   ```
5. Monitor container logs:
   ```bash
   docker-compose logs -f --tail=100
   ```
