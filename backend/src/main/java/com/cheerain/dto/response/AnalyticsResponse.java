package com.cheerain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private Integer totalNFTs;
    private BigDecimal totalPayment;
    private BigDecimal avgPayment;
    private Integer venueAttendees;
    private List<PlayerStats> playerStats;
    private List<PaymentMethodStats> paymentStats;
    private List<MonthlyStats> monthlyStats;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlayerStats {
        private String playerName;
        private Long count;
        private BigDecimal totalPayment;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentMethodStats {
        private String method;
        private Long count;
        private BigDecimal total;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyStats {
        private String month;
        private Long count;
        private BigDecimal payment;
    }
}
