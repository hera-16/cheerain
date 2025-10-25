package com.cheerain.repository;

import com.cheerain.entity.MatchView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchViewRepository extends JpaRepository<MatchView, String> {
    
    // 特定の試合の閲覧数を取得
    long countByMatchId(String matchId);
    
    // 年度別の総閲覧数を取得
    @Query("SELECT COUNT(v) FROM MatchView v " +
           "JOIN Match m ON v.matchId = m.id " +
           "WHERE YEAR(m.matchDate) = :year")
    long countByYear(@Param("year") int year);
    
    // 年度別の統計情報を取得
    @Query("SELECT new map(" +
           "YEAR(m.matchDate) as year, " +
           "COUNT(DISTINCT v.id) as totalViews, " +
           "COUNT(DISTINCT m.id) as totalMatches, " +
           "SUM(CASE WHEN m.location = 'HOME' AND m.homeScore > m.awayScore THEN 1 " +
           "         WHEN m.location = 'AWAY' AND m.awayScore > m.homeScore THEN 1 " +
           "         ELSE 0 END) as wins, " +
           "SUM(CASE WHEN m.homeScore = m.awayScore AND m.homeScore IS NOT NULL THEN 1 ELSE 0 END) as draws, " +
           "SUM(CASE WHEN m.location = 'HOME' AND m.homeScore < m.awayScore THEN 1 " +
           "         WHEN m.location = 'AWAY' AND m.awayScore < m.homeScore THEN 1 " +
           "         ELSE 0 END) as losses) " +
           "FROM Match m " +
           "LEFT JOIN MatchView v ON v.matchId = m.id " +
           "WHERE YEAR(m.matchDate) = :year " +
           "GROUP BY YEAR(m.matchDate)")
    List<Object> getYearlyStats(@Param("year") int year);
}
