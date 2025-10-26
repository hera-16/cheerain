package com.cheerain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YearlyStatsResponse {
    private int year;
    private long totalViews;
    private long totalMatches;
    private long wins;
    private long draws;
    private long losses;
}
