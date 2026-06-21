package com.abhinandan.portfolio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // e.g. Backend, Frontend, Database, Cloud, Tools, Architecture

    @Column(name = "proficiency_level")
    private Integer proficiencyLevel; // 1 to 10

    @Column(name = "planetary_coords", length = 50)
    private String planetaryCoords; // Format "x,y,z" for 3D coordinates
}
