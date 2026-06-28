package com.abhinandan.portfolio.repository;

import com.abhinandan.portfolio.model.ArchitectureNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArchitectureNodeRepository extends JpaRepository<ArchitectureNode, String> {
}
