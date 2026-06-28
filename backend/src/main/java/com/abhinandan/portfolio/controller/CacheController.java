package com.abhinandan.portfolio.controller;

import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/cache")
@CrossOrigin(origins = "*")
public class CacheController {

    private final CacheManager cacheManager;

    public CacheController(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @PostMapping("/clear")
    public ResponseEntity<?> clearAllCaches() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            var cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        });
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "All backend caches flushed successfully.");
        return ResponseEntity.ok(response);
    }
}
