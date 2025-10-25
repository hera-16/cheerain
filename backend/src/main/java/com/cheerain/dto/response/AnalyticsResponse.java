package com.cheerain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private Long totalUsers;
    private Long totalNfts;
    private Long totalPlayers;
    private Long activeUsers;
    private List<PlayerRankingResponse> topPlayers;
    private List<PaymentMethodStats> paymentMethodStats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentMethodStats {
        private String paymentMethod;
        private Long count;
    }
}
