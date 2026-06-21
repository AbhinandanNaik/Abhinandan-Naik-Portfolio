package com.abhinandan.portfolio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "certifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String organization;

    @Column(name = "issue_date", nullable = false, length = 50)
    private String issueDate;

    @Column(name = "verification_url")
    private String verificationUrl;

    @Column(name = "skills_gained")
    private String skillsGained;
}
