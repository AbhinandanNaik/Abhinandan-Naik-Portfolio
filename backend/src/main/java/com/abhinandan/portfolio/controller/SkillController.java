package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.model.Skill;
import com.abhinandan.portfolio.repository.SkillRepository;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
@CrossOrigin(origins = "*")
public class SkillController {

    private final SkillRepository skillRepository;

    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @GetMapping
    @Cacheable(value = "skills")
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @PostMapping
    @CacheEvict(value = "skills", allEntries = true)
    public Skill createSkill(@Valid @RequestBody Skill skill) {
        return skillRepository.save(skill);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "skills", allEntries = true)
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @Valid @RequestBody Skill skillDetails) {
        return skillRepository.findById(id)
                .map(skill -> {
                    skill.setName(skillDetails.getName());
                    skill.setCategory(skillDetails.getCategory());
                    skill.setProficiencyLevel(skillDetails.getProficiencyLevel());
                    skill.setPlanetaryCoords(skillDetails.getPlanetaryCoords());
                    return ResponseEntity.ok(skillRepository.save(skill));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "skills", allEntries = true)
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        return skillRepository.findById(id)
                .map(skill -> {
                    skillRepository.delete(skill);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
