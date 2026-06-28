package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.model.ArchitectureNode;
import com.abhinandan.portfolio.repository.ArchitectureNodeRepository;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/architecture")
@CrossOrigin(origins = "*")
public class ArchitectureController {

    private final ArchitectureNodeRepository architectureNodeRepository;

    public ArchitectureController(ArchitectureNodeRepository architectureNodeRepository) {
        this.architectureNodeRepository = architectureNodeRepository;
    }

    @GetMapping
    @Cacheable(value = "architecture")
    public List<ArchitectureNode> getArchitectureNodes() {
        return architectureNodeRepository.findAll();
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "architecture", allEntries = true)
    public ResponseEntity<ArchitectureNode> updateArchitectureNode(@PathVariable String id, @Valid @RequestBody ArchitectureNode nodeDetails) {
        return architectureNodeRepository.findById(id)
                .map(node -> {
                    node.setName(nodeDetails.getName());
                    node.setTech(nodeDetails.getTech());
                    node.setIcon(nodeDetails.getIcon());
                    node.setColor(nodeDetails.getColor());
                    node.setTitle(nodeDetails.getTitle());
                    node.setDescription(nodeDetails.getDescription());
                    node.setFlowSequence(nodeDetails.getFlowSequence());
                    node.setConnections(nodeDetails.getConnections());
                    return ResponseEntity.ok(architectureNodeRepository.save(node));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
