-- 1. Users & Roles
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- Default admin user: credentials 'admin' / 'admin123'
-- Bcrypt of 'admin123' is $2a$10$yH9K4rR38p9a5Qn39W6lzeF7p/jXzS5M4mHh7iZlXQ8Lq26G6r13G
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$yH9K4rR38p9a5Qn39W6lzeF7p/jXzS5M4mHh7iZlXQ8Lq26G6r13G', 'ADMIN');

-- 2. Projects
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subtitle VARCHAR(150),
    description TEXT,
    tech_stack VARCHAR(255) NOT NULL,
    live_url VARCHAR(255),
    github_url VARCHAR(255),
    features TEXT, -- comma or pipe separated
    challenges TEXT,
    impact TEXT,
    metrics TEXT -- JSON or key-value summary
);

INSERT INTO projects (name, subtitle, description, tech_stack, live_url, github_url, features, challenges, impact, metrics) VALUES
('TrackWise', 'Enterprise Asset Tracking System', 'Enterprise Asset Tracking System — A full-stack application for managing organizational assets with maintenance scheduling, warranty tracking, real-time notifications, and comprehensive analytics dashboard.', 'Java, Spring Boot, PostgreSQL, Flyway, JWT, Docker, React', 'https://trackwise-demo.abhinandannaik.com', 'https://github.com/abhinandan-naik/trackwise', 'Asset Management|Maintenance Tracking|Smart Notifications|Warranty Management|Analytics & Reports|Role-Based Access', 'Handling transaction rollback across multi-step maintenance jobs and optimizing deep-join reports.', 'Improved asset lifecycle visibility and reduced machinery downtime by 24% across testing sites.', 'API Design:REST,Auth Security:JWT,Containerized:Docker,OpenAPI Docs:v3'),
('Smart Bin Management System', 'IoT Waste Monitoring & Optimization', 'IoT-powered intelligent waste management system using ESP8266 microcontrollers with real-time fill level detection, smart monitoring, route optimization algorithms, and live dashboard visualization for smart cities.', 'ESP8266, Blynk IoT, Route Optimization, C++', NULL, 'https://github.com/abhinandan-naik/smart-bin', 'Fill Level Detection|Smart Monitoring|Route Optimization|Real-time Tracking|Dashboard Viz|IoT Integration', 'Ensuring reliable sensor readouts under extreme temperature variations and battery power management.', 'Reduced waste collector fuel usage by 18% through dynamic routing optimization.', 'Hardware:IoT,Monitoring:Real-time,Routing:Smart,Connected:Cloud');

-- 3. Experience
CREATE TABLE experiences (
    id BIGSERIAL PRIMARY KEY,
    role VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    period VARCHAR(50) NOT NULL,
    description TEXT,
    highlights TEXT -- pipe-separated details
);

INSERT INTO experiences (role, company, period, description, highlights) VALUES
('Backend Java Developer', 'Digit Insurance', '2024 — PRESENT', 'Building and maintaining critical insurance backend systems. Responsible for designing RESTful APIs, implementing business logic, optimizing database queries, and ensuring high availability of core services.', '🔌 API Development: Designed and implemented RESTful APIs using Spring Boot handling high-throughput insurance workflows|🗄️ Database Optimization: Optimized PostgreSQL queries reducing average response times and improving system throughput|🔒 Security Implementation: Implemented JWT-based authentication and role-based access control for secure API endpoints|🐳 Containerization: Dockerized microservices and set up CI/CD pipelines for automated testing and deployment|📊 System Architecture: Contributed to microservices decomposition and API gateway configuration|🧪 Testing: Wrote unit and integration tests ensuring high code quality standards');

-- 4. Skills
CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Backend, Frontend, Database, Cloud, Tools, Architecture
    proficiency_level INT CHECK (proficiency_level >= 1 AND proficiency_level <= 10),
    planetary_coords VARCHAR(50) -- "x,y,z"
);

INSERT INTO skills (name, category, proficiency_level, planetary_coords) VALUES
('Java 21', 'Backend', 9, '0.5,0.8,-0.2'),
('Spring Boot 3.5', 'Backend', 9, '-0.4,0.9,0.3'),
('Spring Security', 'Backend', 8, '0.2,0.7,0.5'),
('Hibernate/JPA', 'Backend', 8, '-0.6,0.5,-0.4'),
('React 19', 'Frontend', 7, '0.8,-0.3,0.1'),
('Next.js 15', 'Frontend', 7, '0.6,-0.6,-0.3'),
('TypeScript', 'Frontend', 8, '0.9,-0.1,0.4'),
('PostgreSQL', 'Database', 8, '-0.7,-0.4,0.6'),
('MySQL', 'Database', 7, '-0.5,-0.6,-0.5'),
('Redis', 'Database', 8, '-0.3,-0.8,0.2'),
('Docker', 'Cloud', 8, '0.1,-0.9,-0.6'),
('AWS Cloud', 'Cloud', 7, '0.3,-0.5,0.7'),
('GitHub Actions', 'Cloud', 7, '-0.1,-0.7,-0.8'),
('Nginx', 'Cloud', 7, '-0.8,0.2,-0.2'),
('Git/GitHub', 'Tools', 9, '0.1,0.2,0.9'),
('Postman', 'Tools', 8, '0.4,0.1,-0.9'),
('Prometheus/Grafana', 'Tools', 7, '-0.2,-0.2,0.8'),
('Microservices', 'Architecture', 8, '-0.9,0.6,0.1'),
('System Design', 'Architecture', 8, '0.0,0.8,0.0');

-- 5. Certifications
CREATE TABLE certifications (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    organization VARCHAR(100) NOT NULL,
    issue_date VARCHAR(50) NOT NULL,
    verification_url VARCHAR(255),
    skills_gained VARCHAR(255)
);

INSERT INTO certifications (name, organization, issue_date, verification_url, skills_gained) VALUES
('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2024', 'https://aws.amazon.com/verification', 'Cloud Infrastructure, S3, EC2, CloudFront'),
('Spring Boot Microservices', 'Udemy / Spring.io', '2024', NULL, 'Spring Security, Microservices Architecture, Spring Cloud'),
('Docker & Kubernetes', 'DevOps Track', '2023', NULL, 'Containerization, Deployment, CI/CD');

-- 6. Blogs
CREATE TABLE blogs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    summary VARCHAR(255),
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags VARCHAR(255), -- comma-separated
    categories VARCHAR(255) -- comma-separated
);

INSERT INTO blogs (title, slug, content, summary, published, tags, categories) VALUES
('Architecting Resilient Microservices with Spring Boot 3.5', 'architecting-resilient-microservices-spring-boot-35', '### Introduction\nIn today''s distributed world, microservices must be resilient, secure, and easily observable. Spring Boot 3.5 offers enhancements that make system integration cleaner. In this article, we cover gateway filters, custom JWT decoders, and database query optimizations using Spring Data JPA.\n\n### Designing the Gateway\nAn API Gateway is critical for request validation and circuit breaking. Nginx can acts as our external gateway while Spring Cloud Gateway orchestrates service routing...\n\n### Conclusion\nBuilding enterprise systems is about trade-offs. Caching with Redis reduces lookup delays, and tracing with Actuator ensures failures are spotted immediately.', 'A comprehensive guide to microservices reliability, circuit breaking, caching policies, and performance bottlenecks in Spring Boot.', TRUE, 'Spring Boot,Microservices,Architecture', 'Backend,Software Architecture');

-- 7. Contact Messages
CREATE TABLE contact_messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(150),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- 8. Visitor Analytics
CREATE TABLE visitor_analytics (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    country VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    page_visited VARCHAR(255) NOT NULL,
    duration INT DEFAULT 0, -- in seconds
    action_performed VARCHAR(100), -- e.g., "DOWNLOAD_RESUME", "VIEW_PROJECT"
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
