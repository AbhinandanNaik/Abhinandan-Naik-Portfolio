package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.model.Experience;
import com.abhinandan.portfolio.repository.ExperienceRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/experiences")
@CrossOrigin(origins = "*")
public class ExperienceController {

    private final ExperienceRepository experienceRepository;

    public ExperienceController(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    @GetMapping
    public List<Experience> getAllExperiences() {
        return experienceRepository.findAll();
    }

    @PostMapping
    public Experience createExperience(@Valid @RequestBody Experience experience) {
        return experienceRepository.save(experience);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experience> updateExperience(@PathVariable Long id, @Valid @RequestBody Experience expDetails) {
        return experienceRepository.findById(id)
                .map(exp -> {
                    exp.setRole(expDetails.getRole());
                    exp.setCompany(expDetails.getCompany());
                    exp.setPeriod(expDetails.getPeriod());
                    exp.setDescription(expDetails.getDescription());
                    exp.setHighlights(expDetails.getHighlights());
                    return ResponseEntity.ok(experienceRepository.save(exp));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long id) {
        return experienceRepository.findById(id)
                .map(exp -> {
                    experienceRepository.delete(exp);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
