package com.abhinandan.portfolio.config;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.IThrowableProxy;
import ch.qos.logback.classic.spi.StackTraceElementProxy;
import ch.qos.logback.core.AppenderBase;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class DbLogAppender extends AppenderBase<ILoggingEvent> {

    @Override
    protected void append(ILoggingEvent eventObject) {
        if (eventObject == null) return;

        String loggerName = eventObject.getLoggerName();

        // ⚠️ CRITICAL MITIGATION: STRICT EXCLUSIONS TO PREVENT RECURSIVE SQL LOG LOOPS ⚠️
        if (loggerName == null ||
            loggerName.startsWith("org.hibernate") ||
            loggerName.startsWith("org.springframework.orm") ||
            loggerName.startsWith("org.springframework.jdbc") ||
            loggerName.startsWith("org.springframework.transaction") ||
            loggerName.startsWith("com.zaxxer.hikari") ||
            loggerName.startsWith("org.postgresql") ||
            loggerName.startsWith("org.flywaydb") ||
            loggerName.startsWith("com.abhinandan.portfolio.service.DbLogProcessor") ||
            loggerName.startsWith("com.abhinandan.portfolio.config")
        ) {
            return;
        }

        // Format Throwable proxy stack traces (e.g. for ERROR / Exception logs)
        String exceptionStr = null;
        IThrowableProxy throwableProxy = eventObject.getThrowableProxy();
        if (throwableProxy != null) {
            StringBuilder sb = new StringBuilder();
            sb.append(throwableProxy.getClassName()).append(": ").append(throwableProxy.getMessage()).append("\n");
            StackTraceElementProxy[] stepArray = throwableProxy.getStackTraceElementProxyArray();
            if (stepArray != null) {
                for (StackTraceElementProxy step : stepArray) {
                    sb.append("\tat ").append(step.getSTEAsString()).append("\n");
                }
            }
            exceptionStr = sb.toString();
        }

        // Convert Logback timestamp to local LocalDateTime
        LocalDateTime ldt = LocalDateTime.ofInstant(
            Instant.ofEpochMilli(eventObject.getTimeStamp()), 
            ZoneId.systemDefault()
        );

        LogQueue.LogEntry log = LogQueue.LogEntry.builder()
            .level(eventObject.getLevel().toString())
            .logger(loggerName)
            .message(eventObject.getFormattedMessage())
            .exception(exceptionStr)
            .createdAt(ldt)
            .build();

        LogQueue.offer(log);
    }
}
