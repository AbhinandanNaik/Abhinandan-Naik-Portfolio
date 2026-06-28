package com.abhinandan.portfolio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "architecture_nodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArchitectureNode {
    @Id
    @Column(length = 50)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String tech;

    @Column(nullable = false, length = 50)
    private String icon;

    @Column(nullable = false, length = 20)
    private String color;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "flow_sequence", columnDefinition = "TEXT", nullable = false)
    private String flowSequence;

    @Column(length = 255)
    private String connections;
}
