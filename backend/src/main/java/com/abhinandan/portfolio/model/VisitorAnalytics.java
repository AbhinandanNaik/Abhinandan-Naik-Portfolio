package com.abhinandan.portfolio.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "visitor_analytics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitorAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "session_id", nullable = false, length = 100)
    private String sessionId;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(length = 100)
    private String country;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(length = 50)
    private String browser;

    @Column(name = "page_visited", nullable = false, length = 255)
    private String pageVisited;

    private Integer duration; // in seconds

    @Column(name = "action_performed", length = 100)
    private String actionPerformed; // e.g. "DOWNLOAD_RESUME", "VIEW_PROJECT"

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
        if (duration == null) {
            duration = 0;
        }
    }
}
