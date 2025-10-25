package com.cheerain.dto.request;

import lombok.Data;

@Data
public class MatchRequest {
    private Integer round;
    private String matchDate; // ISO 8601 format
    private String homeTeam;
    private String awayTeam;
    private Integer homeScore;
    private Integer awayScore;
    private String location; // HOME/AWAY
    private String stadium;
    private String competition; // J3リーグ、天皇杯、ルヴァンカップ
    private String matchInfoUrl;
}
