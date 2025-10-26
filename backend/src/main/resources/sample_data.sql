-- Sample Data for Cheerain Application
-- Players, Matches, and Venues

-- Clear existing data (optional)
-- DELETE FROM match_views;
-- DELETE FROM matches;
-- DELETE FROM players;
-- DELETE FROM venues WHERE code != '12345';

-- ============================================
-- VENUES (Stadiums)
-- ============================================
INSERT INTO venues (code, name, is_active, valid_from, valid_until) VALUES
('TOKYO', '東京スタジアム', TRUE, '2025-01-01 00:00:00', '2025-12-31 23:59:59'),
('OSAKA', '大阪サッカー専用スタジアム', TRUE, '2025-01-01 00:00:00', '2025-12-31 23:59:59'),
('YOKOH', '横浜国際総合競技場', TRUE, '2025-01-01 00:00:00', '2025-12-31 23:59:59'),
('埼玉', '埼玉スタジアム2002', TRUE, '2025-01-01 00:00:00', '2025-12-31 23:59:59'),
('NAGOY', '豊田スタジアム', TRUE, '2025-01-01 00:00:00', '2025-12-31 23:59:59');

-- ============================================
-- PLAYERS (Sample Team Roster)
-- ============================================

-- Goalkeepers (GK)
INSERT INTO players (id, name, number, position, is_active, created_at, updated_at) VALUES
(UUID(), '山田 太郎', 1, 'GK', TRUE, NOW(), NOW()),
(UUID(), '佐藤 健二', 12, 'GK', TRUE, NOW(), NOW()),
(UUID(), '鈴木 勇気', 21, 'GK', TRUE, NOW(), NOW());

-- Defenders (DF)
INSERT INTO players (id, name, number, position, is_active, created_at, updated_at) VALUES
(UUID(), '田中 一郎', 2, 'DF', TRUE, NOW(), NOW()),
(UUID(), '伊藤 大輔', 3, 'DF', TRUE, NOW(), NOW()),
(UUID(), '渡辺 誠', 4, 'DF', TRUE, NOW(), NOW()),
(UUID(), '中村 剛', 5, 'DF', TRUE, NOW(), NOW()),
(UUID(), '小林 健太', 15, 'DF', TRUE, NOW(), NOW()),
(UUID(), '加藤 翔太', 19, 'DF', TRUE, NOW(), NOW()),
(UUID(), '吉田 麻也', 22, 'DF', TRUE, NOW(), NOW()),
(UUID(), '山口 蛍', 24, 'DF', TRUE, NOW(), NOW());

-- Midfielders (MF)
INSERT INTO players (id, name, number, position, is_active, created_at, updated_at) VALUES
(UUID(), '松本 拓也', 6, 'MF', TRUE, NOW(), NOW()),
(UUID(), '井上 隼人', 7, 'MF', TRUE, NOW(), NOW()),
(UUID(), '木村 浩二', 8, 'MF', TRUE, NOW(), NOW()),
(UUID(), '林 優太', 10, 'MF', TRUE, NOW(), NOW()),
(UUID(), '斉藤 陸', 13, 'MF', TRUE, NOW(), NOW()),
(UUID(), '森 啓介', 14, 'MF', TRUE, NOW(), NOW()),
(UUID(), '池田 航', 16, 'MF', TRUE, NOW(), NOW()),
(UUID(), '橋本 雄大', 17, 'MF', TRUE, NOW(), NOW()),
(UUID(), '石川 龍', 20, 'MF', TRUE, NOW(), NOW()),
(UUID(), '長谷川 颯', 23, 'MF', TRUE, NOW(), NOW());

-- Forwards (FW)
INSERT INTO players (id, name, number, position, is_active, created_at, updated_at) VALUES
(UUID(), '高橋 勇斗', 9, 'FW', TRUE, NOW(), NOW()),
(UUID(), '前田 大然', 11, 'FW', TRUE, NOW(), NOW()),
(UUID(), '清水 駿', 18, 'FW', TRUE, NOW(), NOW()),
(UUID(), '藤本 和樹', 25, 'FW', TRUE, NOW(), NOW()),
(UUID(), '上田 綺世', 27, 'FW', TRUE, NOW(), NOW());

-- ============================================
-- MATCHES (Season 2025)
-- ============================================

-- J1 League Matches
INSERT INTO matches (id, home_team, away_team, home_score, away_score, match_date, stadium, location, round, competition, match_info_url, created_at, updated_at) VALUES
(UUID(), 'チェライン FC', '横浜 FC', 3, 1, '2025-03-01 14:00:00', '東京スタジアム', 'HOME', 1, 'J1', 'https://example.com/match1', NOW(), NOW()),
(UUID(), '浦和レッズ', 'チェライン FC', 2, 2, '2025-03-08 15:00:00', '埼玉スタジアム2002', 'AWAY', 2, 'J1', 'https://example.com/match2', NOW(), NOW()),
(UUID(), 'チェライン FC', '鹿島アントラーズ', 1, 0, '2025-03-15 14:00:00', '東京スタジアム', 'HOME', 3, 'J1', 'https://example.com/match3', NOW(), NOW()),
(UUID(), 'ガンバ大阪', 'チェライン FC', 1, 3, '2025-03-22 16:00:00', '大阪サッカー専用スタジアム', 'AWAY', 4, 'J1', 'https://example.com/match4', NOW(), NOW()),
(UUID(), 'チェライン FC', '名古屋グランパス', 2, 1, '2025-04-05 14:00:00', '東京スタジアム', 'HOME', 5, 'J1', 'https://example.com/match5', NOW(), NOW()),
(UUID(), 'セレッソ大阪', 'チェライン FC', 0, 1, '2025-04-12 15:00:00', '大阪サッカー専用スタジアム', 'AWAY', 6, 'J1', 'https://example.com/match6', NOW(), NOW()),
(UUID(), 'チェライン FC', '川崎フロンターレ', 2, 2, '2025-04-19 14:00:00', '東京スタジアム', 'HOME', 7, 'J1', 'https://example.com/match7', NOW(), NOW()),
(UUID(), 'FC東京', 'チェライン FC', 1, 2, '2025-04-26 16:00:00', '東京スタジアム', 'AWAY', 8, 'J1', 'https://example.com/match8', NOW(), NOW()),
(UUID(), 'チェライン FC', 'サンフレッチェ広島', 3, 0, '2025-05-03 14:00:00', '東京スタジアム', 'HOME', 9, 'J1', 'https://example.com/match9', NOW(), NOW()),
(UUID(), 'ヴィッセル神戸', 'チェライン FC', 2, 1, '2025-05-10 15:00:00', '大阪サッカー専用スタジアム', 'AWAY', 10, 'J1', 'https://example.com/match10', NOW(), NOW());

-- Emperor's Cup Matches
INSERT INTO matches (id, home_team, away_team, home_score, away_score, match_date, stadium, location, round, competition, match_info_url, created_at, updated_at) VALUES
(UUID(), 'チェライン FC', '柏レイソル', 2, 0, '2025-05-17 14:00:00', '東京スタジアム', 'HOME', 1, '天皇杯', 'https://example.com/cup1', NOW(), NOW()),
(UUID(), 'チェライン FC', '横浜Fマリノス', 1, 1, '2025-06-07 14:00:00', '横浜国際総合競技場', 'AWAY', 2, '天皇杯', 'https://example.com/cup2', NOW(), NOW());

-- Upcoming Matches (No scores yet)
INSERT INTO matches (id, home_team, away_team, home_score, away_score, match_date, stadium, location, round, competition, match_info_url, created_at, updated_at) VALUES
(UUID(), 'チェライン FC', 'アビスパ福岡', NULL, NULL, '2025-11-01 14:00:00', '東京スタジアム', 'HOME', 11, 'J1', 'https://example.com/match11', NOW(), NOW()),
(UUID(), '北海道コンサドーレ札幌', 'チェライン FC', NULL, NULL, '2025-11-08 13:00:00', '札幌ドーム', 'AWAY', 12, 'J1', 'https://example.com/match12', NOW(), NOW()),
(UUID(), 'チェライン FC', '京都サンガF.C.', NULL, NULL, '2025-11-15 14:00:00', '東京スタジアム', 'HOME', 13, 'J1', 'https://example.com/match13', NOW(), NOW()),
(UUID(), '湘南ベルマーレ', 'チェライン FC', NULL, NULL, '2025-11-22 15:00:00', '湘南BMWスタジアム平塚', 'AWAY', 14, 'J1', 'https://example.com/match14', NOW(), NOW()),
(UUID(), 'チェライン FC', 'アルビレックス新潟', NULL, NULL, '2025-11-29 14:00:00', '東京スタジアム', 'HOME', 15, 'J1', 'https://example.com/match15', NOW(), NOW());

-- ============================================
-- Summary Stats
-- ============================================
-- Total Players: 26 (GK: 3, DF: 8, MF: 10, FW: 5)
-- Total Matches: 17 (Completed: 12, Upcoming: 5)
-- Home Record: W6 D1 L0 (Goals: 16-5)
-- Away Record: W3 D2 L1 (Goals: 10-9)
-- Total: W9 D3 L1 (Points: 30)
