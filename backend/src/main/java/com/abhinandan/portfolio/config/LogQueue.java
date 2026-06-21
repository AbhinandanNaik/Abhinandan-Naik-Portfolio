package com.abhinandan.portfolio.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class LogQueue {
    // Bound the queue size to 5,000 to prevent OOM memory leaks under extreme loads
    public static final BlockingQueue<LogEntry> queue = new LinkedBlockingQueue<>(5000);

    public static void offer(LogEntry entry) {
        // non-blocking offer, returns false immediately and drops log if queue is full
        queue.offer(entry);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LogEntry {
        private String level;
        private String logger;
        private String message;
        private String exception;
        private LocalDateTime createdAt;
    }
}
