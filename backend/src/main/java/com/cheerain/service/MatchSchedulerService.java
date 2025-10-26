package com.cheerain.service;

import com.cheerain.entity.Match;
import com.cheerain.repository.MatchRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class MatchSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(MatchSchedulerService.class);
    private static final String SCHEDULE_URL = "https://www.giravanz.jp/game/schedule.html";

    @Autowired
    private MatchRepository matchRepository;

    /**
     * 毎日正午（12:00）に試合データを自動更新
     * cron: 秒 分 時 日 月 曜日
     */
    @Scheduled(cron = "0 0 12 * * ?", zone = "Asia/Tokyo")
    @Transactional
    public void updateMatchData() {
        logger.info("試合データの自動更新を開始します - {}", LocalDateTime.now());
        
        try {
            // 公式サイトから試合データを取得
            Document doc = Jsoup.connect(SCHEDULE_URL)
                    .userAgent("Mozilla/5.0")
                    .timeout(10000)
                    .get();

            logger.info("公式サイトからデータを取得しました");

            // HTMLの解析とデータ更新のロジック
            // 注: 実際のHTML構造に応じて調整が必要
            Elements matchElements = doc.select(".match-item, .game-item, tr.match");
            
            int updatedCount = 0;
            int newCount = 0;

            for (Element matchElement : matchElements) {
                try {
                    // HTMLから試合情報を抽出（構造に応じて要調整）
                    String dateStr = extractText(matchElement, ".date, .match-date");
                    String homeTeam = extractText(matchElement, ".home-team");
                    String awayTeam = extractText(matchElement, ".away-team");
                    String scoreStr = extractText(matchElement, ".score");
                    String venue = extractText(matchElement, ".venue, .stadium");
                    String competition = extractText(matchElement, ".competition, .tournament");

                    if (dateStr == null || dateStr.isEmpty()) {
                        continue;
                    }

                    // 北九州の試合のみを処理
                    if (!homeTeam.contains("北九州") && !awayTeam.contains("北九州")) {
                        continue;
                    }

                    // 試合データを作成または更新
                    Match match = createOrUpdateMatch(
                        dateStr, homeTeam, awayTeam, scoreStr, venue, competition
                    );

                    if (match != null) {
                        matchRepository.save(match);
                        if (match.getId() != null) {
                            updatedCount++;
                        } else {
                            newCount++;
                        }
                    }

                } catch (Exception e) {
                    logger.error("試合データの処理中にエラーが発生: {}", e.getMessage());
                }
            }

            logger.info("試合データの自動更新が完了しました - 新規: {}, 更新: {}", newCount, updatedCount);

        } catch (Exception e) {
            logger.error("試合データの自動更新中にエラーが発生しました: {}", e.getMessage(), e);
        }
    }

    /**
     * HTML要素からテキストを抽出
     */
    private String extractText(Element element, String selector) {
        Element selected = element.selectFirst(selector);
        return selected != null ? selected.text().trim() : "";
    }

    /**
     * 試合データを作成または更新
     */
    private Match createOrUpdateMatch(String dateStr, String homeTeam, String awayTeam, 
                                     String scoreStr, String venue, String competition) {
        try {
            // 日付のパース（フォーマットは実際のサイトに合わせて調整）
            LocalDateTime matchDate = parseMatchDate(dateStr);
            
            // スコアのパース
            Integer homeScore = null;
            Integer awayScore = null;
            if (scoreStr != null && scoreStr.matches("\\d+\\s*-\\s*\\d+")) {
                String[] scores = scoreStr.split("-");
                homeScore = Integer.parseInt(scores[0].trim());
                awayScore = Integer.parseInt(scores[1].trim());
            }

            // 既存の試合を検索（日付とチーム名で）
            Match existingMatch = matchRepository.findByMatchDateAndHomeTeamAndAwayTeam(
                matchDate, homeTeam, awayTeam
            );

            Match match;
            if (existingMatch != null) {
                match = existingMatch;
            } else {
                match = new Match();
                match.setId(UUID.randomUUID().toString());
                match.setMatchDate(matchDate);
                match.setHomeTeam(homeTeam);
                match.setAwayTeam(awayTeam);
            }

            // データ更新
            match.setHomeScore(homeScore);
            match.setAwayScore(awayScore);
            match.setStadium(venue);
            match.setCompetition(competition != null && !competition.isEmpty() ? competition : "J3リーグ");
            
            // HOMEかAWAYかを判定
            match.setLocation(homeTeam.contains("北九州") ? "HOME" : "AWAY");

            // 結果を計算
            if (homeScore != null && awayScore != null) {
                boolean isHome = homeTeam.contains("北九州");
                int kitakyushuScore = isHome ? homeScore : awayScore;
                int opponentScore = isHome ? awayScore : homeScore;

                if (kitakyushuScore > opponentScore) {
                    match.setResult("WIN");
                } else if (kitakyushuScore < opponentScore) {
                    match.setResult("LOSE");
                } else {
                    match.setResult("DRAW");
                }
            } else {
                match.setResult("SCHEDULED");
            }

            return match;

        } catch (Exception e) {
            logger.error("試合データの作成中にエラー: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 日付文字列をLocalDateTimeにパース
     */
    private LocalDateTime parseMatchDate(String dateStr) {
        // 実際のフォーマットに応じて調整が必要
        // 例: "2025年10月25日 14:00" -> LocalDateTime
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm");
            return LocalDateTime.parse(dateStr, formatter);
        } catch (Exception e) {
            logger.warn("日付のパースに失敗: {}", dateStr);
            return LocalDateTime.now();
        }
    }

    /**
     * 手動で更新をトリガー（テスト用）
     */
    public void manualUpdate() {
        logger.info("手動更新がトリガーされました");
        updateMatchData();
    }
}
