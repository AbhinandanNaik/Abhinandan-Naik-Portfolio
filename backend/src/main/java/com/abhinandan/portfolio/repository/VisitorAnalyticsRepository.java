package com.abhinandan.portfolio.repository;

import com.abhinandan.portfolio.model.VisitorAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitorAnalyticsRepository extends JpaRepository<VisitorAnalytics, Long> {

    @Query("SELECT COUNT(DISTINCT v.sessionId) FROM VisitorAnalytics v")
    long countUniqueVisitors();

    @Query("SELECT COUNT(v) FROM VisitorAnalytics v WHERE v.actionPerformed = :action")
    long countActions(String action);

    @Query("SELECT v.country, COUNT(DISTINCT v.sessionId) FROM VisitorAnalytics v WHERE v.country IS NOT NULL GROUP BY v.country ORDER BY COUNT(DISTINCT v.sessionId) DESC")
    List<Object[]> countVisitorsByCountry();

    @Query("SELECT v.deviceType, COUNT(DISTINCT v.sessionId) FROM VisitorAnalytics v WHERE v.deviceType IS NOT NULL GROUP BY v.deviceType ORDER BY COUNT(DISTINCT v.sessionId) DESC")
    List<Object[]> countVisitorsByDevice();

    @Query("SELECT v.pageVisited, COUNT(v) FROM VisitorAnalytics v GROUP BY v.pageVisited ORDER BY COUNT(v) DESC")
    List<Object[]> countPageViews();

    List<VisitorAnalytics> findTop100ByOrderByTimestampDesc();
}
