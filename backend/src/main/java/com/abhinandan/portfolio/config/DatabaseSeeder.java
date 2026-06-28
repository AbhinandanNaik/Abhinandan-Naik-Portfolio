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
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          ExperienceRepository experienceRepository,
                          ProjectRepository projectRepository,
                          SkillRepository skillRepository,
                          CertificationRepository certificationRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.certificationRepository = certificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedExperiences();
        seedProjects();
        seedSkills();
        seedCertifications();
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
}
