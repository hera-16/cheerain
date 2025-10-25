package com.cheerain.service;

import com.cheerain.entity.Match;
import com.cheerain.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchScraperService {
    private final MatchRepository matchRepository;
    private static final String GIRAVANZ_SCHEDULE_URL = "https://www.giravanz.jp/game/schedule.html";

    /**
     * 毎日AM12:00に実行
     */
    @Scheduled(cron = "0 0 12 * * *", zone = "Asia/Tokyo")
    @Transactional
    public void scrapeAndUpdateMatches() {
        log.info("試合データの自動更新を開始します");
        try {
            List<Match> matches = scrapeMatches();
            log.info("{}件の試合データを取得しました", matches.size());
            
            // 既存データを削除して新しいデータを挿入
            matchRepository.deleteAll();
            matchRepository.saveAll(matches);
            
            log.info("試合データの更新が完了しました");
        } catch (Exception e) {
            log.error("試合データの更新中にエラーが発生しました", e);
        }
    }

    private List<Match> scrapeMatches() throws Exception {
        List<Match> matches = new ArrayList<>();
        
        Document doc = Jsoup.connect(GIRAVANZ_SCHEDULE_URL)
                .userAgent("Mozilla/5.0")
                .timeout(10000)
                .get();

        // 試合情報を含むテーブル行を取得
        Elements rows = doc.select("table tr");
        
        for (Element row : rows) {
            try {
                Match match = parseMatchRow(row);
                if (match != null) {
                    matches.add(match);
                }
            } catch (Exception e) {
                log.warn("試合データのパースに失敗: {}", e.getMessage());
            }
        }
        
        return matches;
    }

    private Match parseMatchRow(Element row) {
        Elements cells = row.select("td");
        if (cells.size() < 5) {
            return null;
        }

        try {
            // 節数
            String roundText = cells.get(0).text().trim();
            Integer round = parseRound(roundText);
            if (round == null) {
                return null;
            }

            // 日時
            String dateText = cells.get(1).text().trim();
            LocalDateTime matchDate = parseMatchDate(dateText);
            if (matchDate == null) {
                return null;
            }

            // 対戦カード・スコア
            String matchInfo = cells.get(2).text().trim();
            String[] teams = parseTeams(matchInfo);
            if (teams == null || teams.length != 2) {
                return null;
            }
            String homeTeam = teams[0];
            String awayTeam = teams[1];

            // スコア
            Integer[] scores = parseScore(matchInfo);
            Integer homeScore = scores != null ? scores[0] : null;
            Integer awayScore = scores != null ? scores[1] : null;

            // ホーム/アウェイ
            String location = cells.get(3).text().trim();
            if (!location.equals("HOME") && !location.equals("AWAY")) {
                location = homeTeam.contains("北九州") ? "HOME" : "AWAY";
            }

            // 会場
            String stadium = cells.get(4).text().trim();

            // 大会名（デフォルトはJ3リーグ）
            String competition = "J3リーグ";
            
            // 試合情報URL
            String matchInfoUrl = "";
            Elements links = cells.get(2).select("a");
            if (!links.isEmpty()) {
                matchInfoUrl = "https://www.giravanz.jp" + links.first().attr("href");
            }

            return Match.builder()
                    .round(round)
                    .matchDate(matchDate)
                    .homeTeam(homeTeam)
                    .awayTeam(awayTeam)
                    .homeScore(homeScore)
                    .awayScore(awayScore)
                    .location(location)
                    .stadium(stadium)
                    .competition(competition)
                    .matchInfoUrl(matchInfoUrl)
                    .build();

        } catch (Exception e) {
            log.debug("行のパースをスキップ: {}", e.getMessage());
            return null;
        }
    }

    private Integer parseRound(String text) {
        try {
            return Integer.parseInt(text.replaceAll("[^0-9]", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private LocalDateTime parseMatchDate(String text) {
        try {
            // 例: "2.22(土)14:00" または "10.25(土)14:00"
            Pattern pattern = Pattern.compile("(\\d+)\\.(\\d+).*?(\\d+):(\\d+)");
            Matcher matcher = pattern.matcher(text);
            
            if (matcher.find()) {
                int month = Integer.parseInt(matcher.group(1));
                int day = Integer.parseInt(matcher.group(2));
                int hour = Integer.parseInt(matcher.group(3));
                int minute = Integer.parseInt(matcher.group(4));
                
                // 年度の推定（現在月より前なら次年度）
                int year = LocalDateTime.now().getYear();
                if (month < LocalDateTime.now().getMonthValue()) {
                    year++;
                }
                
                return LocalDateTime.of(year, month, day, hour, minute);
            }
        } catch (Exception e) {
            log.debug("日時パースエラー: {}", text);
        }
        return null;
    }

    private String[] parseTeams(String text) {
        // 例: "北九州 2: 0 長野" または "北九州 1: 1 相模原"
        String[] parts = text.split("vs|VS|:|-");
        if (parts.length >= 2) {
            return new String[]{
                parts[0].trim().replaceAll("[0-9]", "").trim(),
                parts[parts.length - 1].trim().replaceAll("[0-9]", "").trim()
            };
        }
        return null;
    }

    private Integer[] parseScore(String text) {
        // 例: "北九州 2: 0 長野"
        Pattern pattern = Pattern.compile("(\\d+)\\s*:\\s*(\\d+)");
        Matcher matcher = pattern.matcher(text);
        
        if (matcher.find()) {
            return new Integer[]{
                Integer.parseInt(matcher.group(1)),
                Integer.parseInt(matcher.group(2))
            };
        }
        return null;
    }
}
