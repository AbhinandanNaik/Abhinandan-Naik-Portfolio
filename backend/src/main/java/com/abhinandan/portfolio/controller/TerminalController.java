package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.model.TerminalCommand;
import com.abhinandan.portfolio.repository.TerminalCommandRepository;
import jakarta.validation.Valid;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/terminal")
@CrossOrigin(origins = "*")
public class TerminalController {

    private final TerminalCommandRepository terminalCommandRepository;

    public TerminalController(TerminalCommandRepository terminalCommandRepository) {
        this.terminalCommandRepository = terminalCommandRepository;
    }

    @GetMapping
    @Cacheable(value = "terminal")
    public List<TerminalCommand> getTerminalCommands() {
        return terminalCommandRepository.findAll();
    }

    @PutMapping("/{commandName}")
    @CacheEvict(value = "terminal", allEntries = true)
    public ResponseEntity<TerminalCommand> updateTerminalCommand(@PathVariable String commandName, @Valid @RequestBody TerminalCommand commandDetails) {
        return terminalCommandRepository.findByCommandName(commandName.toLowerCase())
                .map(command -> {
                    command.setType(commandDetails.getType());
                    command.setResponseLines(commandDetails.getResponseLines());
                    return ResponseEntity.ok(terminalCommandRepository.save(command));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
