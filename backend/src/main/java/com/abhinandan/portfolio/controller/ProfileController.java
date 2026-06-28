package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.model.Profile;
import com.abhinandan.portfolio.repository.ProfileRepository;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileRepository profileRepository;

    public ProfileController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @GetMapping
    @Cacheable(value = "profile")
    public ResponseEntity<Profile> getProfile() {
        return profileRepository.findAll().stream()
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    @CacheEvict(value = "profile", allEntries = true)
    public ResponseEntity<Profile> updateProfile(@Valid @RequestBody Profile profileDetails) {
        return profileRepository.findAll().stream()
                .findFirst()
                .map(profile -> {
                    profile.setName(profileDetails.getName());
                    profile.setTitle(profileDetails.getTitle());
                    profile.setAvailableStatus(profileDetails.getAvailableStatus());
                    profile.setBio(profileDetails.getBio());
                    profile.setResumeUrl(profileDetails.getResumeUrl());
                    profile.setGithubUrl(profileDetails.getGithubUrl());
                    profile.setLinkedinUrl(profileDetails.getLinkedinUrl());
                    profile.setEmail(profileDetails.getEmail());
                    return ResponseEntity.ok(profileRepository.save(profile));
                })
                .orElseGet(() -> {
                    // Fallback to create if none exists
                    return ResponseEntity.ok(profileRepository.save(profileDetails));
                });
    }
}
