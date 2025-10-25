package com.cheerain.service;

import com.cheerain.dto.response.AnalyticsResponse;
import com.cheerain.dto.response.PlayerRankingResponse;
import com.cheerain.entity.Nft;
import com.cheerain.repository.NftRepository;
import com.cheerain.repository.PlayerRepository;
import com.cheerain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final UserRepository userRepository;
    private final NftRepository nftRepository;
    private final PlayerRepository playerRepository;

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics() {
        AnalyticsResponse response = new AnalyticsResponse();

        // 基本統計
        response.setTotalUsers(userRepository.count());
        response.setTotalNfts(nftRepository.count());
        response.setTotalPlayers(playerRepository.count());
        response.setActiveUsers(nftRepository.countDistinctCreators());

        // 選手ランキング
        List<Object[]> rankingData = nftRepository.findPlayerRanking();
        List<PlayerRankingResponse> topPlayers = new ArrayList<>();
        int rank = 1;
        for (Object[] row : rankingData) {
            String playerName = (String) row[0];
            Long count = (Long) row[1];
            topPlayers.add(new PlayerRankingResponse(playerName, count, rank++));
        }
        response.setTopPlayers(topPlayers);

        // 決済方法統計
        List<Object[]> paymentStats = nftRepository.findPaymentMethodStats();
        List<AnalyticsResponse.PaymentMethodStats> paymentMethodStats = paymentStats.stream()
                .map(row -> new AnalyticsResponse.PaymentMethodStats(
                        ((Nft.PaymentMethod) row[0]).name().toLowerCase(),
                        (Long) row[1]
                ))
                .collect(Collectors.toList());
        response.setPaymentMethodStats(paymentMethodStats);

        return response;
    }

    @Transactional(readOnly = true)
    public List<PlayerRankingResponse> getPlayerRanking(int limit) {
        List<Object[]> rankingData = nftRepository.findPlayerRanking();
        List<PlayerRankingResponse> ranking = new ArrayList<>();
        int rank = 1;
        for (Object[] row : rankingData) {
            if (rank > limit) break;
            String playerName = (String) row[0];
            Long count = (Long) row[1];
            ranking.add(new PlayerRankingResponse(playerName, count, rank++));
        }
        return ranking;
    }
}
