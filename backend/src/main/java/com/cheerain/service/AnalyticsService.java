package com.cheerain.service;

import com.cheerain.dto.response.AnalyticsResponse;
import com.cheerain.entity.Nft;
import com.cheerain.repository.NftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final NftRepository nftRepository;

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics() {
        List<Nft> allNfts = nftRepository.findAll();

        // 総合統計
        Integer totalNFTs = allNfts.size();
        BigDecimal totalPayment = allNfts.stream()
                .map(Nft::getPaymentAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal avgPayment = totalNFTs > 0
                ? totalPayment.divide(BigDecimal.valueOf(totalNFTs), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        Integer venueAttendees = (int) allNfts.stream()
                .filter(nft -> nft.getIsVenueAttendee() != null && nft.getIsVenueAttendee())
                .count();

        // 選手別統計
        Map<String, List<Nft>> playerGroups = allNfts.stream()
                .collect(Collectors.groupingBy(Nft::getPlayerName));

        List<AnalyticsResponse.PlayerStats> playerStats = playerGroups.entrySet().stream()
                .map(entry -> {
                    String playerName = entry.getKey();
                    List<Nft> nfts = entry.getValue();
                    Long count = (long) nfts.size();
                    BigDecimal totalPlayerPayment = nfts.stream()
                            .map(Nft::getPaymentAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return AnalyticsResponse.PlayerStats.builder()
                            .playerName(playerName)
                            .count(count)
                            .totalPayment(totalPlayerPayment)
                            .build();
                })
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());

        // 支払方法別統計
        Map<String, List<Nft>> paymentMethodGroups = allNfts.stream()
                .collect(Collectors.groupingBy(nft -> nft.getPaymentMethod().name()));

        List<AnalyticsResponse.PaymentMethodStats> paymentStats = paymentMethodGroups.entrySet().stream()
                .map(entry -> {
                    String method = entry.getKey();
                    List<Nft> nfts = entry.getValue();
                    Long count = (long) nfts.size();
                    BigDecimal total = nfts.stream()
                            .map(Nft::getPaymentAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return AnalyticsResponse.PaymentMethodStats.builder()
                            .method(method)
                            .count(count)
                            .total(total)
                            .build();
                })
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());

        // 月別統計（過去12ヶ月）
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年M月");
        Map<String, List<Nft>> monthlyGroups = allNfts.stream()
                .collect(Collectors.groupingBy(nft -> nft.getCreatedAt().format(formatter)));

        List<AnalyticsResponse.MonthlyStats> monthlyStats = monthlyGroups.entrySet().stream()
                .map(entry -> {
                    String month = entry.getKey();
                    List<Nft> nfts = entry.getValue();
                    Long count = (long) nfts.size();
                    BigDecimal payment = nfts.stream()
                            .map(Nft::getPaymentAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return AnalyticsResponse.MonthlyStats.builder()
                            .month(month)
                            .count(count)
                            .payment(payment)
                            .build();
                })
                .sorted(Comparator.comparing(AnalyticsResponse.MonthlyStats::getMonth))
                .limit(12)
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .totalNFTs(totalNFTs)
                .totalPayment(totalPayment)
                .avgPayment(avgPayment)
                .venueAttendees(venueAttendees)
                .playerStats(playerStats)
                .paymentStats(paymentStats)
                .monthlyStats(monthlyStats)
                .build();
    }
}
