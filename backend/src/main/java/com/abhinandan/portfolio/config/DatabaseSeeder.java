package com.abhinandan.portfolio.config;

import com.abhinandan.portfolio.model.*;
import com.abhinandan.portfolio.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final CertificationRepository certificationRepository;
    private final ProfileRepository profileRepository;
    private final ArchitectureNodeRepository architectureNodeRepository;
    private final TerminalCommandRepository terminalCommandRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          ExperienceRepository experienceRepository,
                          ProjectRepository projectRepository,
                          SkillRepository skillRepository,
                          CertificationRepository certificationRepository,
                          ProfileRepository profileRepository,
                          ArchitectureNodeRepository architectureNodeRepository,
                          TerminalCommandRepository terminalCommandRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
        this.profileRepository = profileRepository;
        this.architectureNodeRepository = architectureNodeRepository;
        this.terminalCommandRepository = terminalCommandRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedExperiences();
        seedProjects();
        seedSkills();
        seedCertifications();
        seedProfiles();
        seedArchitectureNodes();
        seedTerminalCommands();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            System.out.println(">>> SEED: Admin user created.");
        }
    }

    private void seedExperiences() {
        if (experienceRepository.count() == 0) {
            Experience exp = Experience.builder()
                    .role("Software Engineer")
                    .company("Digit Insurance")
                    .period("July 2025 — Present")
                    .description("Architecting and deploying scalable backend services for Motor Loader and Motor Insurance modules.")
                    .highlights("🔌 Backend API Architecture: Architected and deployed scalable backend services for the Motor Loader and Single Page modules using Java and Spring Boot|🗄️ Database Schema Optimization: Designed and optimized complex, high-volume database schemas using PostgreSQL, utilizing DBeaver for query tuning|🐳 Continuous Integration (CI/CD): Streamlined the software development lifecycle by integrating Bitbucket and Jenkins for automated deployment pipelines|☸️ Container Orchestration: Orchestrated scalable containerized services via Kubernetes to ensure high-availability, zero-downtime releases|📊 Telemetry & Monitoring: Leveraged Dynatrace for continuous endpoint validation and performance monitoring, contributing to Agentic AI automation")
                    .build();
            experienceRepository.save(exp);
            System.out.println(">>> SEED: Experiences seeded.");
        }
    }

    private void seedProjects() {
        if (projectRepository.count() == 0) {
            Project p1 = Project.builder()
                    .name("FlowSync")
                    .subtitle("AI-Powered Collaborative Kanban Board")
                    .description("A real-time task management system that orchestrates low-latency data synchronization, scalable state management, and AI-driven workflow automation.")
                    .techStack("Next.js, Supabase, Zustand, React Query, AI Integration")
                    .githubUrl("https://github.com/abhinandan-naik/flowsync")
                    .features("Real-time Task Sync|Scalable State Management|AI Workflow Automation|Collaborative Kanban")
                    .challenges("Solving concurrency issues during real-time board updates and managing state sync latency.")
                    .impact("Enabled collaborative real-time sync with less than 50ms latency.")
                    .metrics("Frontend:Next.js,Sync:Supabase,State:Zustand,AI:Agentic")
                    .build();

            Project p2 = Project.builder()
                    .name("FlashPoll")
                    .subtitle("Real-Time Instant Voting Application")
                    .description("A low-latency instant voting platform featuring real-time data broadcasting, secure session management, and a highly responsive user interface.")
                    .techStack("Node.js, Express, Socket.io, React")
                    .githubUrl("https://github.com/abhinandan-naik/flashpoll")
                    .features("Real-time Data Broadcasting|Secure Session Management|Responsive UI|Instant Statistics")
                    .challenges("Managing high socket connection density and preventing double voting through session guards.")
                    .impact("Achieved sub-100ms real-time results propagation to thousands of active clients.")
                    .metrics("Backend:Node.js,Real-time:WebSockets,Routing:Express,Guards:Session")
                    .build();

            Project p3 = Project.builder()
                    .name("Smart-Bin")
                    .subtitle("IoT-Based Urban Waste Management System")
                    .description("An end-to-end IoT solution that integrates ESP8266 microcontrollers and sensor hardware with a centralized admin dashboard, enabling real-time tracking, bin capacity monitoring, and route optimization.")
                    .techStack("ESP8266, IoT Sensor Hardware, C++, Next.js, PostgreSQL")
                    .githubUrl("https://github.com/abhinandan-naik/smart-bin")
                    .features("Real-time Bin Monitoring|Route Optimization|Centralized Admin Dashboard|GPS Tracking")
                    .challenges("Handling sensor calibrating noise and calculating optimized paths for collection fleets.")
                    .impact("Reduced municipal waste collection fuel consumption by 18% through dynamic routing.")
                    .metrics("Hardware:IoT,Microcontroller:ESP8266,Dashboard:Next.js,Optimization:Routing")
                    .build();

            projectRepository.saveAll(Arrays.asList(p1, p2, p3));
            System.out.println(">>> SEED: Projects seeded.");
        }
    }

    private void seedSkills() {
        if (skillRepository.count() == 0) {
            skillRepository.saveAll(Arrays.asList(
                    new Skill(null, "Java", "Backend", 9, "0.5,0.8,-0.2"),
                    new Skill(null, "Spring Boot", "Backend", 9, "-0.4,0.9,0.3"),
                    new Skill(null, "Microservices", "Backend", 8, "0.2,0.7,0.5"),
                    new Skill(null, "PostgreSQL", "Database", 8, "-0.7,-0.4,0.6"),
                    new Skill(null, "MySQL", "Database", 7, "-0.5,-0.6,-0.5"),
                    new Skill(null, "Redis", "Database", 8, "-0.3,-0.8,0.2"),
                    new Skill(null, "Next.js", "Frontend", 8, "0.6,-0.6,-0.3"),
                    new Skill(null, "React", "Frontend", 8, "0.8,-0.3,0.1"),
                    new Skill(null, "TypeScript", "Frontend", 8, "0.9,-0.1,0.4"),
                    new Skill(null, "Kubernetes", "Cloud", 8, "0.1,-0.9,-0.6"),
                    new Skill(null, "Docker", "Cloud", 8, "0.3,-0.5,0.7"),
                    new Skill(null, "Jenkins", "Tools", 8, "-0.1,-0.7,-0.8"),
                    new Skill(null, "Bitbucket", "Tools", 8, "-0.8,0.2,-0.2"),
                    new Skill(null, "Dynatrace", "Tools", 8, "0.1,0.2,0.9"),
                    new Skill(null, "System Design", "Architecture", 8, "0.0,0.8,0.0")
            ));
            System.out.println(">>> SEED: Skills seeded.");
        }
    }

    private void seedCertifications() {
        if (certificationRepository.count() == 0) {
            certificationRepository.saveAll(Arrays.asList(
                    new Certification(null, "Digit Mastermind (3x Winner)", "Digit Insurance", "2025", null, "System Optimization, Feature Delivery, Microservices Performance"),
                    new Certification(null, "Algorithmic Problem Solving (LeetCode 1847)", "LeetCode", "2025", "https://leetcode.com", "Data Structures, Algorithms, Competitive Programming"),
                    new Certification(null, "Generative AI Specialist", "Google Cloud Gen AI Academy", "2025", null, "Prompt Optimization, Cloud AI Architecture, LLM Integrations")
            ));
            System.out.println(">>> SEED: Certifications seeded.");
        }
    }

    private void seedProfiles() {
        if (profileRepository.count() == 0) {
            Profile profile = Profile.builder()
                    .name("Abhinandan Naik")
                    .title("Backend Java Engineer & Systems Architect")
                    .availableStatus("Available for Opportunities")
                    .bio("Engineering scalable, high-throughput distributed architectures using Java, Spring Boot, SQL databases, and modern cloud deployment patterns. Currently engineering backend systems at Digit Insurance.")
                    .resumeUrl("/Abhinandan_Naik_Resume.pdf")
                    .githubUrl("https://github.com/abhinandan-naik")
                    .linkedinUrl("https://linkedin.com/in/abhinandan-naik")
                    .email("abhinandannaik1717@gmail.com")
                    .build();
            profileRepository.save(profile);
            System.out.println(">>> SEED: Profiles seeded.");
        }
    }

    private void seedArchitectureNodes() {
        if (architectureNodeRepository.count() == 0) {
            architectureNodeRepository.saveAll(Arrays.asList(
                    new ArchitectureNode("client", "Client Layer", "React / Next.js", "cpu", "#8B5CF6", "Client Layer — React / Next.js 15", "Single-page application pre-rendered using static rendering and optimized using React 19. It serves static layout elements instantly and handles dynamic data fetching asynchronously via React Query.", "User Action ➔ Next.js client intercepts ➔ Fires AJAX request to API Gateway", "gateway"),
                    new ArchitectureNode("gateway", "API Gateway", "Nginx Proxy", "network", "#00F5FF", "API Gateway — Nginx Reverse Proxy", "The single entry checkpoint for all web requests. Offloads SSL handshakes, strips CORS headers, and routes `/api/**` traffic directly to Spring Boot backend services.", "HTTPS Request ➔ SSL Decryption ➔ Header Sanitization ➔ Proxy Forward to Port 8888", "auth,services"),
                    new ArchitectureNode("auth", "Auth Security", "Spring Security / JWT", "key", "#EF4444", "Authentication Service — Security Context Filter", "Stateless access authorization filter. Validates signature claims on incoming JWT tokens, handles admin credential matches via BCrypt, and injects user profiles into the Spring security context.", "Filter checks authorization header ➔ Verifies RS256 JWT key claims ➔ Sets security session", "services"),
                    new ArchitectureNode("services", "Core Services", "Spring Boot 3.5", "server", "#6366F1", "Core Services — Spring Boot Business Logic", "Processes business models and operations. Serves projects datasets, updates blog entries, captures analytical telemetries, and handles automated rate-limiting checks.", "Processes logic ➔ Queries Redis Cache (Read-heavy) ➔ Queries Postgres (Write/Transactional)", "cache,database"),
                    new ArchitectureNode("cache", "Cache Layer", "Redis Memory Cache", "zap", "#FBB324", "Cache Layer — Redis Memory Storage", "High-speed key-value cache. Stores frequently loaded assets and rate limit session trackers, reducing SQL fetch demands by up to 60%.", "Check cache ➔ HIT: return cached JSON ➔ MISS: fetch DB ➔ write to cache ➔ return", ""),
                    new ArchitectureNode("database", "Database", "PostgreSQL DB", "database", "#22C55E", "Database — PostgreSQL Storage", "Persistent transactional database managed with Flyway schema versioning. Configured with optimized index tables on query slugs and composite timestamp logs.", "Spring Boot JPA leases connection ➔ Runs parameterized queries ➔ Commits transaction", "")
            ));
            System.out.println(">>> SEED: Architecture nodes seeded.");
        }
    }

    private void seedTerminalCommands() {
        if (terminalCommandRepository.count() == 0) {
            terminalCommandRepository.saveAll(Arrays.asList(
                    new TerminalCommand(null, "help", "accent", "Available commands:|  about      ➔ Detail developer profile|  skills     ➔ Tech stack & tool metrics|  experience ➔ Commercial work chronology|  projects   ➔ Featured engineering systems|  contact    ➔ Direct communication details|  resume     ➔ Download technical PDF CV|  clear      ➔ Wipe terminal buffer history|  easteregg  ➔ 🎯 Trigger hidden routine"),
                    new TerminalCommand(null, "about", "success", "Name     : Abhinandan Naik|Role     : Full-Stack Software Engineer|Employer : Digit Insurance (Motor Insurance Division)|Degree   : BE (Hons.) Information Science & Engineering|Focus    : Scalable backend APIs, database tuning, and GenAI integrations|Languages: English, Hindi, Kannada|Status   : Open to full-stack software engineering engagements 🚀"),
                    new TerminalCommand(null, "skills", "accent", "Backend  : Java, Spring Boot, Microservices, Security, REST APIs|Database : PostgreSQL, MySQL, Redis, DBeaver database tuning|DevOps   : Kubernetes, Bitbucket, Jenkins CI/CD, Dynatrace validation|Frontend : Next.js, Supabase, TypeScript, React, TailwindCSS"),
                    new TerminalCommand(null, "experience", "secondary", "[July 2025 - Present] Software Engineer @ Digit Insurance|  ➔ Architected scalable backend APIs for Motor Loader & Single Page modules|  ➔ Implemented Redis caching for bulk policy and payment processing|  ➔ Tuned complex database schemas in PostgreSQL to ensure integrity|  ➔ Automated deployment via Bitbucket & Jenkins, microservices in Kubernetes|  ➔ Monitored endpoints using Dynatrace and contributed to Agentic AI automation"),
                    new TerminalCommand(null, "projects", "success", "1. FlowSync ➔ AI-Powered Kanban Board (Next.js, Supabase, State Sync, AI Workflow)|2. FlashPoll ➔ Real-Time Voting Platform (Node.js, Express, Socket.io, Sessions)|3. Smart-Bin ➔ IoT Waste Manager (ESP8266, Sensor dashboard, Route optimization)"),
                    new TerminalCommand(null, "contact", "accent", "Primary Email : abhinandannaik1717@gmail.com|LinkedIn Profile: linkedin.com/in/abhinandan-naik|GitHub Page    : github.com/abhinandan-naik|Availability   : ● ACTIVE FOR INTERVIEWS"),
                    new TerminalCommand(null, "resume", "success", "Assembling technical credentials...|✓ Packaging latest database telemetry...|✓ Compiling PDF binary stream...|➔ Download initiated: Abhinandan_Naik_Resume.pdf 📄"),
                    new TerminalCommand(null, "easteregg", "secondary", "  ╔══════════════════════════════════════════════╗|  ║         EASTER EGG COMPILE SUCCESS 🎉        ║|  ║                                              ║|  ║   " + "Java is to JavaScript as car is to" + "      ║|  ║    carpet.\" - Chris Heilmann                 ║|  ║                                              ║|  ║   Spring != Spring Boot                      ║|  ║   Docker != VM (Virtual Machine)             ║|  ╚══════════════════════════════════════════════╝")
            ));
            System.out.println(">>> SEED: Terminal commands seeded.");
        }
    }
}
