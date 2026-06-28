package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.model.Project;
import com.abhinandan.portfolio.repository.ProjectRepository;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectRepository projectRepository;

    public ProjectController(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @GetMapping
    @Cacheable(value = "projects")
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @CacheEvict(value = "projects", allEntries = true)
    public Project createProject(@Valid @RequestBody Project project) {
        return projectRepository.save(project);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "projects", allEntries = true)
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @Valid @RequestBody Project projectDetails) {
        return projectRepository.findById(id)
                .map(project -> {
                    project.setName(projectDetails.getName());
                    project.setSubtitle(projectDetails.getSubtitle());
                    project.setDescription(projectDetails.getDescription());
                    project.setTechStack(projectDetails.getTechStack());
                    project.setLiveUrl(projectDetails.getLiveUrl());
                    project.setGithubUrl(projectDetails.getGithubUrl());
                    project.setFeatures(projectDetails.getFeatures());
                    project.setChallenges(projectDetails.getChallenges());
                    project.setImpact(projectDetails.getImpact());
                    project.setMetrics(projectDetails.getMetrics());
                    return ResponseEntity.ok(projectRepository.save(project));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "projects", allEntries = true)
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(project -> {
                    projectRepository.delete(project);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
