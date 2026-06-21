package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.dto.MessageResponse;
import com.abhinandan.portfolio.model.VisitorAnalytics;
import com.abhinandan.portfolio.repository.VisitorAnalyticsRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final VisitorAnalyticsRepository visitorAnalyticsRepository;

    public AnalyticsController(VisitorAnalyticsRepository visitorAnalyticsRepository) {
        this.visitorAnalyticsRepository = visitorAnalyticsRepository;
    }

    @PostMapping("/analytics")
    public ResponseEntity<?> trackVisitor(@RequestBody VisitorAnalytics analytics, HttpServletRequest request) {
        if (analytics.getIpAddress() == null || analytics.getIpAddress().isEmpty()) {
            analytics.setIpAddress(getClientIp(request));
        }
        
        // Approximate geo-ip resolution: local request defaults to India for styling
        if (analytics.getCountry() == null || analytics.getCountry().isEmpty()) {
            String ip = analytics.getIpAddress();
            if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
                analytics.setCountry("India (Local)");
            } else {
                analytics.setCountry("United States"); // default placeholder
            }
        }

        visitorAnalyticsRepository.save(analytics);
        return ResponseEntity.ok(new MessageResponse("Telemetry packet accepted"));
    }

    @GetMapping("/admin/analytics")
    public ResponseEntity<?> getAnalyticsSummary() {
        Map<String, Object> summary = new HashMap<>();

        long totalVisits = visitorAnalyticsRepository.count();
        long uniqueVisitors = visitorAnalyticsRepository.countUniqueVisitors();
        long resumeDownloads = visitorAnalyticsRepository.countActions("DOWNLOAD_RESUME");
        long projectViews = visitorAnalyticsRepository.countActions("VIEW_PROJECT");

        // Map breakdowns
        List<Map<String, Object>> deviceBreakdown = new ArrayList<>();
        for (Object[] row : visitorAnalyticsRepository.countVisitorsByDevice()) {
            Map<String, Object> map = new HashMap<>();
            map.put("device", row[0]);
            map.put("count", row[1]);
            deviceBreakdown.add(map);
        }

        List<Map<String, Object>> countryBreakdown = new ArrayList<>();
        for (Object[] row : visitorAnalyticsRepository.countVisitorsByCountry()) {
            Map<String, Object> map = new HashMap<>();
            map.put("country", row[0]);
            map.put("count", row[1]);
            countryBreakdown.add(map);
        }

        List<Map<String, Object>> pageViews = new ArrayList<>();
        for (Object[] row : visitorAnalyticsRepository.countPageViews()) {
            Map<String, Object> map = new HashMap<>();
            map.put("page", row[0]);
            map.put("views", row[1]);
            pageViews.add(map);
        }

        summary.put("totalVisits", totalVisits);
        summary.put("uniqueVisitors", uniqueVisitors);
        summary.put("resumeDownloads", resumeDownloads);
        summary.put("projectViews", projectViews);
        summary.put("deviceBreakdown", deviceBreakdown);
        summary.put("countryBreakdown", countryBreakdown);
        summary.put("pageViews", pageViews);
        summary.put("recentLogs", visitorAnalyticsRepository.findTop100ByOrderByTimestampDesc());

        return ResponseEntity.ok(summary);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
