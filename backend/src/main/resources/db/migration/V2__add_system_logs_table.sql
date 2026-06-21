-- V2: System Logs Table
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    logger VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    exception TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Optimize log retrievals for severity filters and chronologies
CREATE INDEX idx_system_logs_level_created ON system_logs(level, created_at DESC);
