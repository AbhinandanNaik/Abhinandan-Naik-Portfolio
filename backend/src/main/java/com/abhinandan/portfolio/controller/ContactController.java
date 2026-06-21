package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.dto.MessageResponse;
import com.abhinandan.portfolio.model.ContactMessage;
import com.abhinandan.portfolio.repository.ContactMessageRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@CrossOrigin(origins = "*")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    private final ContactMessageRepository contactMessageRepository;
    
    // In-memory rate limiting (IP -> Last submission timestamp)
    private final Map<String, Long> rateLimiter = new ConcurrentHashMap<>();
    private static final long RATE_LIMIT_MS = 60000; // 1 minute limit

    public ContactController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @PostMapping("/contact")
    public ResponseEntity<?> submitContactMessage(@Valid @RequestBody ContactMessage message, HttpServletRequest request) {
        String clientIp = getClientIp(request);
        long now = System.currentTimeMillis();

        if (rateLimiter.containsKey(clientIp)) {
            long lastSubmit = rateLimiter.get(clientIp);
            if (now - lastSubmit < RATE_LIMIT_MS) {
                long secondsLeft = (RATE_LIMIT_MS - (now - lastSubmit)) / 1000;
                return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(new MessageResponse("Too many requests. Please wait " + secondsLeft + " seconds before trying again."));
            }
        }

        // Save message
        ContactMessage saved = contactMessageRepository.save(message);
        rateLimiter.put(clientIp, now);

        // Simulated SMTP Send notification
        logger.info("SMTP MOCK: Sending notification email for contact message ID: {}", saved.getId());
        logger.info("From: {} <{}> | Subject: {}", saved.getName(), saved.getEmail(), saved.getSubject());
        logger.info("Body: {}", saved.getMessage());

        return ResponseEntity.ok(new MessageResponse("Your message has been transmitted successfully. I will get in touch soon!"));
    }

    @GetMapping("/admin/messages")
    public List<ContactMessage> getAdminMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    @PutMapping("/admin/messages/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return contactMessageRepository.findById(id)
                .map(msg -> {
                    msg.setIsRead(true);
                    contactMessageRepository.save(msg);
                    return ResponseEntity.ok(new MessageResponse("Message marked as read"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
