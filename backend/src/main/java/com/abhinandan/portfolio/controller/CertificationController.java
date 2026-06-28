package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.model.Certification;
import com.abhinandan.portfolio.repository.CertificationRepository;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/certifications")
@CrossOrigin(origins = "*")
public class CertificationController {

    private final CertificationRepository certificationRepository;

    public CertificationController(CertificationRepository certificationRepository) {
        this.certificationRepository = certificationRepository;
    }

    @GetMapping
    @Cacheable(value = "certifications")
    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    @PostMapping
    @CacheEvict(value = "certifications", allEntries = true)
    public Certification createCertification(@Valid @RequestBody Certification certification) {
        return certificationRepository.save(certification);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "certifications", allEntries = true)
    public ResponseEntity<Certification> updateCertification(@PathVariable Long id, @Valid @RequestBody Certification certDetails) {
        return certificationRepository.findById(id)
                .map(cert -> {
                    cert.setName(certDetails.getName());
                    cert.setOrganization(certDetails.getOrganization());
                    cert.setIssueDate(certDetails.getIssueDate());
                    cert.setVerificationUrl(certDetails.getVerificationUrl());
                    cert.setSkillsGained(certDetails.getSkillsGained());
                    return ResponseEntity.ok(certificationRepository.save(cert));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "certifications", allEntries = true)
    public ResponseEntity<?> deleteCertification(@PathVariable Long id) {
        return certificationRepository.findById(id)
                .map(cert -> {
                    certificationRepository.delete(cert);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
