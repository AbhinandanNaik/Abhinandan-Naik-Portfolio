package com.abhinandan.portfolio.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private static final Logger logger = LoggerFactory.getLogger(AiController.class);

    @Value("${openai.api.key:}")
    private String openAiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/chat")
    public ResponseEntity<?> getChatResponse(@RequestBody Map<String, String> requestBody) {
        String userMessage = requestBody.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("response", "Empty message received."));
        }

        if (openAiKey != null && !openAiKey.trim().isEmpty()) {
            try {
                String openAiResponse = callOpenAi(userMessage);
                return ResponseEntity.ok(Map.of("response", openAiResponse));
            } catch (Exception e) {
                logger.error("Failed calling OpenAI Chat API, falling back to local engine", e);
            }
        }

        // Fallback local rule-based response engine
        String localResponse = getLocalResponse(userMessage);
        return ResponseEntity.ok(Map.of("response", localResponse));
    }

    private String callOpenAi(String userMessage) {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiKey);

        String systemPrompt = "You are a helpful, professional AI assistant on Abhinandan Naik's Portfolio. " +
                "Abhinandan is a Backend Java Developer at Digit Insurance. He holds a BE (Hons.) in Information Science and Engineering. " +
                "His core stack includes Java 21, Spring Boot 3.5, Spring Security, JWT, JPA, PostgreSQL, MySQL, Redis, Docker, Git, AWS Basics, and Next.js. " +
                "He built TrackWise (an Enterprise Asset Tracker using Spring Boot, PostgreSQL, Docker, React) and Smart Bin Management System (an IoT waste monitoring system). " +
                "Keep answers brief, highly technical, professional, and friendly. Answer queries about his resume, stack, projects, and contact info (abhinandan@email.com).";

        Map<String, Object> request = new HashMap<>();
        request.put("model", "gpt-3.5-turbo");
        request.put("messages", Arrays.asList(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userMessage)
        ));
        request.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            List choices = (List) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map firstChoice = (Map) choices.get(0);
                Map message = (Map) firstChoice.get("message");
                if (message != null) {
                    return (String) message.get("content");
                }
            }
        }
        throw new RuntimeException("Unexpected response structure from OpenAI API");
    }

    private String getLocalResponse(String userMessage) {
        String msg = userMessage.toLowerCase();

        if (msg.contains("hi") || msg.contains("hello") || msg.contains("hey")) {
            return "Hello! I am Abhinandan's AI Assistant. You can ask me about his work experience, technical stack, or projects. How can I help you today? 🤖";
        }
        if (msg.contains("experience") || msg.contains("work") || msg.contains("digit") || msg.contains("role") || msg.contains("job")) {
            return "Abhinandan Naik is a Backend Java Developer at Digit Insurance (2024 - Present). He develops and maintains core insurance microservices, designs RESTful APIs, optimizes PostgreSQL queries, and integrates secure token auth systems. He has 2+ years of hands-on Java development experience! 💼";
        }
        if (msg.contains("project") || msg.contains("trackwise") || msg.contains("smart bin") || msg.contains("build")) {
            return "Abhinandan has built several high-grade systems: \n" +
                    "1. **TrackWise**: Enterprise Asset Tracking System using Spring Boot, PostgreSQL, Flyway, JWT, Docker, and React. Focuses on asset lifecycle tracking, maintenance, and reports.\n" +
                    "2. **Smart Bin Management**: IoT waste level checking system with ESP8266 and routing path optimizations.\n" +
                    "Which project details would you like to hear about? 🚀";
        }
        if (msg.contains("skill") || msg.contains("technology") || msg.contains("tech") || msg.contains("stack") || msg.contains("language") || msg.contains("java")) {
            return "Abhinandan's primary stack includes:\n" +
                    "- **Core & Backend**: Java 21, Spring Boot 3.5, Spring Security, JWT, Hibernate/JPA, Maven\n" +
                    "- **Frontend**: React 19, Next.js 15, TypeScript, TailwindCSS\n" +
                    "- **Databases**: PostgreSQL, MySQL, Redis, Flyway\n" +
                    "- **DevOps & Infrastructure**: Docker, Docker Compose, Nginx, GitHub Actions, AWS basics\n" +
                    "- **Tools**: IntelliJ IDEA, Postman, Git, Prometheus, Grafana ⚙️";
        }
        if (msg.contains("contact") || msg.contains("hire") || msg.contains("email") || msg.contains("reach")) {
            return "You can get in touch with Abhinandan directly by submitting the form in the **Contact** section, emailing him at **abhinandan@email.com**, or connecting on LinkedIn! He is open to discussions about backend engineering roles. 🟢";
        }
        if (msg.contains("resume") || msg.contains("cv") || msg.contains("pdf")) {
            return "You can download his technical resume directly by clicking the 'Resume' button in the Hero section or typing 'resume' in the interactive terminal below! 📄";
        }
        if (msg.contains("education") || msg.contains("college") || msg.contains("university") || msg.contains("degree")) {
            return "Abhinandan holds a BE (Hons.) in Information Science and Engineering (2020 - 2024), where he studied core computer science fundamentals, data structures, algorithms, and database systems. 🎓";
        }
        return "I'm a localized bot representing Abhinandan Naik. I can share details on his Spring Boot skills, PostgreSQL expertise, microservices projects, and career history. Try asking 'What is TrackWise?' or 'Where does he work?'! 💡";
    }
}
