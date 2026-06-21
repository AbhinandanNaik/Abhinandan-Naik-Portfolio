# REST API Documentation - HQ Backend

This specification documents the REST API endpoints exposed by the Spring Boot portfolio backend.

---

## 1. Authentication Endpoints

### Login (Generate Tokens)
* **Method & URL**: `POST /api/auth/login`
* **Auth Required**: None (Public)
* **Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
* **Success Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

### Refresh Access Token
* **Method & URL**: `POST /api/auth/refresh`
* **Auth Required**: None (Public)
* **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
}
```
* **Success Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "role": "ADMIN"
}
```

---

## 2. Public Read-Only Endpoints

### Fetch Featured Projects
* **Method & URL**: `GET /api/projects`
* **Auth Required**: None
* **Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "TrackWise",
    "subtitle": "Enterprise Asset Tracking System",
    "description": "Enterprise Asset Tracking...",
    "techStack": "Java, Spring Boot, PostgreSQL, Flyway, JWT, Docker, React",
    "liveUrl": "https://trackwise-demo.abhinandannaik.com",
    "githubUrl": "https://github.com/abhinandan-naik/trackwise",
    "features": "Asset Management|Maintenance Tracking|Smart Notifications",
    "challenges": "Handling transaction rollback across multi-step maintenance...",
    "impact": "Reduced machinery downtime by 24%...",
    "metrics": "API Design:REST,Auth Security:JWT,Containerized:Docker"
  }
]
```

### Fetch Constellation Skills
* **Method & URL**: `GET /api/skills`
* **Auth Required**: None
* **Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Java 21",
    "category": "Backend",
    "proficiencyLevel": 9,
    "planetaryCoords": "0.5,0.8,-0.2"
  }
]
```

### Fetch Career Experiences / Milestones
* **Method & URL**: `GET /api/experiences`
* **Auth Required**: None
* **Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "role": "Backend Java Developer",
    "company": "Digit Insurance",
    "period": "2024 — PRESENT",
    "description": "Building and maintaining critical insurance backend...",
    "highlights": "🔌 API Development: Designed and implemented..."
  }
]
```

### Fetch Published Blogs
* **Method & URL**: `GET /api/blogs`
* **Auth Required**: None
* **Success Response (200 OK)**:
```json
[
  {
    "id": 1,
    "title": "Architecting Resilient Microservices with Spring Boot 3.5",
    "slug": "architecting-resilient-microservices-spring-boot-35",
    "content": "### Introduction\nIn today's distributed world...",
    "summary": "A comprehensive guide to microservices...",
    "published": true,
    "createdAt": "2026-06-21T22:04:22",
    "updatedAt": "2026-06-21T22:04:22",
    "tags": "Spring Boot,Microservices,Architecture",
    "categories": "Backend,Software Architecture"
  }
]
```

---

## 3. Submission & Interaction Endpoints

### Submit Contact Message
* **Method & URL**: `POST /api/contact`
* **Auth Required**: None (Rate limited: 1 req/min per IP)
* **Request Body**:
```json
{
  "name": "Hiring Manager",
  "email": "hiring@company.com",
  "subject": "Interview Request",
  "message": "Let's connect for an introductory backend call."
}
```
* **Success Response (200 OK)**:
```json
{
  "message": "Your message has been transmitted successfully. I will get in touch soon!"
}
```

### Push Telemetry Packet
* **Method & URL**: `POST /api/analytics`
* **Auth Required**: None
* **Request Body**:
```json
{
  "sessionId": "sess_89a0b12c",
  "pageVisited": "/projects",
  "deviceType": "Desktop",
  "browser": "Chrome",
  "actionPerformed": "VIEW_PROJECT"
}
```
* **Success Response (200 OK)**:
```json
{
  "message": "Telemetry packet accepted"
}
```

### AI Chatbot Assistant query
* **Method & URL**: `POST /api/ai/chat`
* **Auth Required**: None
* **Request Body**:
```json
{
  "message": "What is TrackWise?"
}
```
* **Success Response (200 OK)**:
```json
{
  "response": "TrackWise is an Enterprise Asset Tracking System built with Spring Boot..."
}
```

---

## 4. Administrative Modifiers (Auth Required: Bearer AccessToken)

### Fetch Analytics Aggregates (Dashboard)
* **Method & URL**: `GET /api/admin/analytics`
* **Response**: Details unique visitor rates, downloads, page hits, device groups, and recent raw logs.

### Fetch Inbound Contacts Inbox
* **Method & URL**: `GET /api/admin/messages`
* **Response**: Returns chronological arrays of sent contact forms.

### Mark Message as Read
* **Method & URL**: `PUT /api/admin/messages/{id}/read`
* **Response**: `{ "message": "Message marked as read" }`

### Write/Edit/Delete Resources
* **POST `/api/projects`**: Create project details.
* **PUT `/api/projects/{id}`**: Update project.
* **DELETE `/api/projects/{id}`**: Delete project.
* Same CRUD conventions apply to `/api/blogs`, `/api/skills`, `/api/experiences`, and `/api/certifications`.
