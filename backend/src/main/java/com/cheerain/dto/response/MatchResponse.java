package com.cheerain.dto.response;

import com.cheerain.entity.Match;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponse {
    private String id;
    private Integer round;
    private LocalDateTime matchDate;
    private String homeTeam;
    private String awayTeam;
    private Integer homeScore;
    private Integer awayScore;
    private String location;
    private String stadium;
    private String competition;
    private String matchInfoUrl;
    private String result; // WIN/LOSE/DRAW/SCHEDULED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MatchResponse fromEntity(Match match) {
        String result = calculateResult(match);
        
        return MatchResponse.builder()
                .id(match.getId())
                .round(match.getRound())
                .matchDate(match.getMatchDate())
                .homeTeam(match.getHomeTeam())
                .awayTeam(match.getAwayTeam())
                .homeScore(match.getHomeScore())
                .awayScore(match.getAwayScore())
                .location(match.getLocation())
                .stadium(match.getStadium())
                .competition(match.getCompetition())
                .matchInfoUrl(match.getMatchInfoUrl())
                .result(result)
                .createdAt(match.getCreatedAt())
                .updatedAt(match.getUpdatedAt())
                .build();
    }

    private static String calculateResult(Match match) {
        if (match.getHomeScore() == null || match.getAwayScore() == null) {
            return "SCHEDULED";
        }

        boolean isHome = "HOME".equals(match.getLocation());
        int kitakyushuScore = isHome ? match.getHomeScore() : match.getAwayScore();
        int opponentScore = isHome ? match.getAwayScore() : match.getHomeScore();

        if (kitakyushuScore > opponentScore) {
            return "WIN";
        } else if (kitakyushuScore < opponentScore) {
            return "LOSE";
        } else {
            return "DRAW";
        }
    }
}
