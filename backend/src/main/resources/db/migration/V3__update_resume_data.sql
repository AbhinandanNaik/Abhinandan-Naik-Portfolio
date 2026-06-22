-- 1. Update Experiences table
UPDATE experiences 
SET role = 'Software Engineer',
    period = 'July 2025 — Present',
    description = 'Architecting and deploying scalable backend services for Motor Loader and Motor Insurance modules.',
    highlights = '🔌 Backend API Architecture: Architected and deployed scalable backend services for the Motor Loader and Single Page modules using Java and Spring Boot|🗄️ Database Schema Optimization: Designed and optimized complex, high-volume database schemas using PostgreSQL, utilizing DBeaver for query tuning|🐳 Continuous Integration (CI/CD): Streamlined the software development lifecycle by integrating Bitbucket and Jenkins for automated deployment pipelines|☸️ Container Orchestration: Orchestrated scalable containerized services via Kubernetes to ensure high-availability, zero-downtime releases|📊 Telemetry & Monitoring: Leveraged Dynatrace for continuous endpoint validation and performance monitoring, contributing to Agentic AI automation'
WHERE company = 'Digit Insurance';

-- 2. Update Projects table (delete replaced projects, and insert updated projects list)
DELETE FROM projects WHERE name = 'Smart Bin Management System';

-- Insert new projects if they do not exist
INSERT INTO projects (name, subtitle, description, tech_stack, live_url, github_url, features, challenges, impact, metrics) VALUES
('FlowSync', 'AI-Powered Collaborative Kanban Board', 'A real-time task management system that orchestrates low-latency data synchronization, scalable state management, and AI-driven workflow automation.', 'Next.js, Supabase, Zustand, React Query, AI Integration', NULL, 'https://github.com/abhinandan-naik/flowsync', 'Real-time Task Sync|Scalable State Management|AI Workflow Automation|Collaborative Kanban', 'Solving concurrency issues during real-time board updates and managing state sync latency.', 'Enabled collaborative real-time sync with less than 50ms latency.', 'Frontend:Next.js,Sync:Supabase,State:Zustand,AI:Agentic'),
('FlashPoll', 'Real-Time Instant Voting Application', 'A low-latency instant voting platform featuring real-time data broadcasting, secure session management, and a highly responsive user interface.', 'Node.js, Express, Socket.io, React', NULL, 'https://github.com/abhinandan-naik/flashpoll', 'Real-time Data Broadcasting|Secure Session Management|Responsive UI|Instant Statistics', 'Managing high socket connection density and preventing double voting through session guards.', 'Achieved sub-100ms real-time results propagation to thousands of active clients.', 'Backend:Node.js,Real-time:WebSockets,Routing:Express,Guards:Session'),
('Smart-Bin', 'IoT-Based Urban Waste Management System', 'An end-to-end IoT solution that integrates ESP8266 microcontrollers and sensor hardware with a centralized admin dashboard, enabling real-time tracking, bin capacity monitoring, and route optimization.', 'ESP8266, IoT Sensor Hardware, C++, Next.js, PostgreSQL', NULL, 'https://github.com/abhinandan-naik/smart-bin', 'Real-time Bin Monitoring|Route Optimization|Centralized Admin Dashboard|GPS Tracking', 'Handling sensor calibrating noise and calculating optimized paths for collection fleets.', 'Reduced municipal waste collection fuel consumption by 18% through dynamic routing.', 'Hardware:IoT,Microcontroller:ESP8266,Dashboard:Next.js,Optimization:Routing');

-- 3. Reset and update Skills table
DELETE FROM skills;
INSERT INTO skills (name, category, proficiency_level, planetary_coords) VALUES
('Java', 'Backend', 9, '0.5,0.8,-0.2'),
('Spring Boot', 'Backend', 9, '-0.4,0.9,0.3'),
('Microservices', 'Backend', 8, '0.2,0.7,0.5'),
('PostgreSQL', 'Database', 8, '-0.7,-0.4,0.6'),
('MySQL', 'Database', 7, '-0.5,-0.6,-0.5'),
('Redis', 'Database', 8, '-0.3,-0.8,0.2'),
('Next.js', 'Frontend', 8, '0.6,-0.6,-0.3'),
('React', 'Frontend', 8, '0.8,-0.3,0.1'),
('TypeScript', 'Frontend', 8, '0.9,-0.1,0.4'),
('Kubernetes', 'Cloud', 8, '0.1,-0.9,-0.6'),
('Docker', 'Cloud', 8, '0.3,-0.5,0.7'),
('Jenkins', 'Tools', 8, '-0.1,-0.7,-0.8'),
('Bitbucket', 'Tools', 8, '-0.8,0.2,-0.2'),
('Dynatrace', 'Tools', 8, '0.1,0.2,0.9'),
('System Design', 'Architecture', 8, '0.0,0.8,0.0');

-- 4. Reset and update Certifications table
DELETE FROM certifications;
INSERT INTO certifications (name, organization, issue_date, verification_url, skills_gained) VALUES
('Digit Mastermind (3x Winner)', 'Digit Insurance', '2025', NULL, 'System Optimization, Feature Delivery, Microservices Performance'),
('Algorithmic Problem Solving (LeetCode 1847)', 'LeetCode', '2025', 'https://leetcode.com', 'Data Structures, Algorithms, Competitive Programming'),
('Generative AI Specialist', 'Google Cloud Gen AI Academy', '2025', NULL, 'Prompt Optimization, Cloud AI Architecture, LLM Integrations');
