-- ギラヴァンツ北九州 2025年度 選手データ更新
-- 公式サイト: https://www.giravanz.jp/topteam/staff_player/

-- 既存の選手データをすべて削除
DELETE FROM players;

-- GK（ゴールキーパー）
INSERT INTO players (id, number, name, position, is_active, created_at, updated_at) VALUES
(UUID(), 1, '伊藤 剛', 'GK', TRUE, NOW(), NOW()),
(UUID(), 27, '田中 悠也', 'GK', TRUE, NOW(), NOW()),
(UUID(), 31, '大谷 幸輝', 'GK', TRUE, NOW(), NOW()),
(UUID(), 39, '谷口 璃成', 'GK', TRUE, NOW(), NOW()),
(UUID(), 41, '杉本 光希', 'GK', TRUE, NOW(), NOW());

-- DF（ディフェンダー）
INSERT INTO players (id, number, name, position, is_active, created_at, updated_at) VALUES
(UUID(), 4, '長谷川 光基', 'DF', TRUE, NOW(), NOW()),
(UUID(), 13, '東 廉太', 'DF', TRUE, NOW(), NOW()),
(UUID(), 22, '山脇 樺織', 'DF', TRUE, NOW(), NOW()),
(UUID(), 42, '世良 務', 'DF', TRUE, NOW(), NOW()),
(UUID(), 44, '辻岡 佑真', 'DF', TRUE, NOW(), NOW()),
(UUID(), 50, '杉山 耕二', 'DF', TRUE, NOW(), NOW());

-- MF（ミッドフィルダー）
INSERT INTO players (id, number, name, position, is_active, created_at, updated_at) VALUES
(UUID(), 6, '星 広太', 'MF', TRUE, NOW(), NOW()),
(UUID(), 7, '平原 隆暉', 'MF', TRUE, NOW(), NOW()),
(UUID(), 8, '町田 也真人', 'MF', TRUE, NOW(), NOW()),
(UUID(), 11, '喜山 康平', 'MF', TRUE, NOW(), NOW()),
(UUID(), 14, '井澤 春輝', 'MF', TRUE, NOW(), NOW()),
(UUID(), 17, '岡野 凜平', 'MF', TRUE, NOW(), NOW()),
(UUID(), 20, '矢田 旭', 'MF', TRUE, NOW(), NOW()),
(UUID(), 21, '牛之濵 拓', 'MF', TRUE, NOW(), NOW()),
(UUID(), 24, '吉長 真優', 'MF', TRUE, NOW(), NOW()),
(UUID(), 28, '木實 快斗', 'MF', TRUE, NOW(), NOW()),
(UUID(), 32, '高柳 郁弥', 'MF', TRUE, NOW(), NOW()),
(UUID(), 34, '高吉 正真', 'MF', TRUE, NOW(), NOW()),
(UUID(), 51, '坂下 湧太郎', 'MF', TRUE, NOW(), NOW()),
(UUID(), 66, '髙橋 大悟', 'MF', TRUE, NOW(), NOW());

-- FW（フォワード）
INSERT INTO players (id, number, name, position, is_active, created_at, updated_at) VALUES
(UUID(), 9, '河辺 駿太郎', 'FW', TRUE, NOW(), NOW()),
(UUID(), 10, '永井 龍', 'FW', TRUE, NOW(), NOW()),
(UUID(), 18, '渡邉 颯太', 'FW', TRUE, NOW(), NOW()),
(UUID(), 19, '吉原 楓人', 'FW', TRUE, NOW(), NOW()),
(UUID(), 25, '坪郷 来紀', 'FW', TRUE, NOW(), NOW()),
(UUID(), 29, '高 昇辰', 'FW', TRUE, NOW(), NOW()),
(UUID(), 37, '吉田 晃盛', 'FW', TRUE, NOW(), NOW()),
(UUID(), 49, '駒沢 直哉', 'FW', TRUE, NOW(), NOW()),
(UUID(), 99, '樺山 諒乃介', 'FW', TRUE, NOW(), NOW());

-- 確認用クエリ
SELECT
    position,
    COUNT(*) as count,
    GROUP_CONCAT(CONCAT(number, '. ', name) ORDER BY number SEPARATOR ', ') as players
FROM players
WHERE is_active = TRUE
GROUP BY position
ORDER BY FIELD(position, 'GK', 'DF', 'MF', 'FW');
