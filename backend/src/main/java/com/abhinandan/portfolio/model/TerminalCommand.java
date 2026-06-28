package com.abhinandan.portfolio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "terminal_commands")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TerminalCommand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "command_name", unique = true, nullable = false, length = 50)
    private String commandName;

    @Column(nullable = false, length = 20)
    private String type; // e.g. success, accent, secondary

    @Column(name = "response_lines", columnDefinition = "TEXT", nullable = false)
    private String responseLines; // Pipe-separated string representing console lines
}
