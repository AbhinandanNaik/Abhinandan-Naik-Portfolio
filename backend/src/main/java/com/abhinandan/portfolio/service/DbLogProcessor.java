package com.abhinandan.portfolio.service;

import com.abhinandan.portfolio.config.LogQueue;
import com.abhinandan.portfolio.model.SystemLog;
import com.abhinandan.portfolio.repository.SystemLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DbLogProcessor {

    private final SystemLogRepository systemLogRepository;

    // Drain the log queue in batches of 200 every 3 seconds to optimize DB connection usage
    @Scheduled(fixedDelay = 3000)
    public void flushLogsToDb() {
        if (LogQueue.queue.isEmpty()) return;

        List<LogQueue.LogEntry> buffer = new ArrayList<>();
        LogQueue.queue.drainTo(buffer, 200);

        if (buffer.isEmpty()) return;

        List<SystemLog> systemLogs = buffer.stream()
            .map(entry -> SystemLog.builder()
                .level(entry.getLevel())
                .logger(entry.getLogger())
                .message(entry.getMessage())
                .exception(entry.getException())
                .createdAt(entry.getCreatedAt())
                .build())
            .toList();

        try {
            systemLogRepository.saveAll(systemLogs);
        } catch (Exception e) {
            // Write strictly to standard system error to avoid logging failure logs recursively 
            System.err.println("Database Logging Failed: Unable to flush logs buffer. Details: " + e.getMessage());
        }
    }
}
