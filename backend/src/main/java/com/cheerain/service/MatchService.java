package com.cheerain.service;

import com.cheerain.dto.request.MatchRequest;
import com.cheerain.dto.response.MatchResponse;
import com.cheerain.dto.response.YearlyStatsResponse;
import com.cheerain.entity.Match;
import com.cheerain.entity.MatchView;
import com.cheerain.exception.ResourceNotFoundException;
import com.cheerain.repository.MatchRepository;
import com.cheerain.repository.MatchViewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final MatchViewRepository matchViewRepository;

    public List<MatchResponse> getAllMatches() {
        return matchRepository.findAllByOrderByMatchDateDesc()
                .stream()
                .map(MatchResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MatchResponse> getMatchesByCompetition(String competition) {
        return matchRepository.findByCompetitionOrderByMatchDateDesc(competition)
                .stream()
                .map(MatchResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public MatchResponse getMatchById(String id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("試合が見つかりません"));
        return MatchResponse.fromEntity(match);
    }

    @Transactional
    public MatchResponse createMatch(MatchRequest request) {
        Match match = Match.builder()
                .round(request.getRound())
                .matchDate(LocalDateTime.parse(request.getMatchDate(), DateTimeFormatter.ISO_DATE_TIME))
                .homeTeam(request.getHomeTeam())
                .awayTeam(request.getAwayTeam())
                .homeScore(request.getHomeScore())
                .awayScore(request.getAwayScore())
                .location(request.getLocation())
                .stadium(request.getStadium())
                .competition(request.getCompetition())
                .matchInfoUrl(request.getMatchInfoUrl())
                .build();

        Match savedMatch = matchRepository.save(match);
        return MatchResponse.fromEntity(savedMatch);
    }

    @Transactional
    public MatchResponse updateMatch(String id, MatchRequest request) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("試合が見つかりません"));

        match.setRound(request.getRound());
        match.setMatchDate(LocalDateTime.parse(request.getMatchDate(), DateTimeFormatter.ISO_DATE_TIME));
        match.setHomeTeam(request.getHomeTeam());
        match.setAwayTeam(request.getAwayTeam());
        match.setHomeScore(request.getHomeScore());
        match.setAwayScore(request.getAwayScore());
        match.setLocation(request.getLocation());
        match.setStadium(request.getStadium());
        match.setCompetition(request.getCompetition());
        match.setMatchInfoUrl(request.getMatchInfoUrl());

        Match updatedMatch = matchRepository.save(match);
        return MatchResponse.fromEntity(updatedMatch);
    }

    @Transactional
    public void deleteMatch(String id) {
        if (!matchRepository.existsById(id)) {
            throw new ResourceNotFoundException("試合が見つかりません");
        }
        matchRepository.deleteById(id);
    }

    // 閲覧記録を追加
    @Transactional
    public void recordView(String matchId, String userId, String ipAddress) {
        if (!matchRepository.existsById(matchId)) {
            throw new ResourceNotFoundException("試合が見つかりません");
        }
        
        MatchView matchView = MatchView.builder()
                .matchId(matchId)
                .userId(userId)
                .ipAddress(ipAddress)
                .build();
        
        matchViewRepository.save(matchView);
    }

    // 年度別統計を取得
    public List<YearlyStatsResponse> getYearlyStats() {
        List<YearlyStatsResponse> statsList = new ArrayList<>();
        
        // 2023年から現在年までの統計を取得
        int currentYear = LocalDateTime.now().getYear();
        for (int year = 2023; year <= currentYear; year++) {
            List<Object> results = matchViewRepository.getYearlyStats(year);
            
            if (!results.isEmpty() && results.get(0) instanceof Map) {
                @SuppressWarnings("unchecked")
                Map<String, Object> statsMap = (Map<String, Object>) results.get(0);
                
                YearlyStatsResponse stats = YearlyStatsResponse.builder()
                        .year(year)
                        .totalViews(statsMap.get("totalViews") != null ? ((Number) statsMap.get("totalViews")).longValue() : 0L)
                        .totalMatches(statsMap.get("totalMatches") != null ? ((Number) statsMap.get("totalMatches")).longValue() : 0L)
                        .wins(statsMap.get("wins") != null ? ((Number) statsMap.get("wins")).longValue() : 0L)
                        .draws(statsMap.get("draws") != null ? ((Number) statsMap.get("draws")).longValue() : 0L)
                        .losses(statsMap.get("losses") != null ? ((Number) statsMap.get("losses")).longValue() : 0L)
                        .build();
                
                statsList.add(stats);
            }
        }
        
        return statsList;
    }

    // 特定年度の統計を取得
    public YearlyStatsResponse getYearlyStatsByYear(int year) {
        List<Object> results = matchViewRepository.getYearlyStats(year);
        
        if (!results.isEmpty() && results.get(0) instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> statsMap = (Map<String, Object>) results.get(0);
            
            return YearlyStatsResponse.builder()
                    .year(year)
                    .totalViews(statsMap.get("totalViews") != null ? ((Number) statsMap.get("totalViews")).longValue() : 0L)
                    .totalMatches(statsMap.get("totalMatches") != null ? ((Number) statsMap.get("totalMatches")).longValue() : 0L)
                    .wins(statsMap.get("wins") != null ? ((Number) statsMap.get("wins")).longValue() : 0L)
                    .draws(statsMap.get("draws") != null ? ((Number) statsMap.get("draws")).longValue() : 0L)
                    .losses(statsMap.get("losses") != null ? ((Number) statsMap.get("losses")).longValue() : 0L)
                    .build();
        }
        
        return YearlyStatsResponse.builder()
                .year(year)
                .totalViews(0L)
                .totalMatches(0L)
                .wins(0L)
                .draws(0L)
                .losses(0L)
                .build();
    }
}
