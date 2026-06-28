package com.abhinandan.portfolio.repository;

import com.abhinandan.portfolio.model.TerminalCommand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TerminalCommandRepository extends JpaRepository<TerminalCommand, Long> {
    Optional<TerminalCommand> findByCommandName(String commandName);
}
