-- 試合データの投入（UTF-8エンコーディング）
DELETE FROM matches;

INSERT INTO matches (id, round, match_date, home_team, away_team, home_score, away_score, location, stadium, competition, match_info_url, created_at, updated_at) VALUES
('ebd8edab-b195-11f0-bf91-36124cea2420', 33, '2025-10-25 14:00:00', '北九州', '琉球', 2, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025102518.html', NOW(), NOW()),
('ebd96e1b-b195-11f0-bf91-36124cea2420', 32, '2025-10-19 14:00:00', '讃岐', '北九州', 1, 4, 'AWAY', '県立丸亀', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025101910.html', NOW(), NOW()),
('ebda1e4b-b195-11f0-bf91-36124cea2420', 31, '2025-10-11 14:00:00', '北九州', '鹿児島', 3, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025101119.html', NOW(), NOW()),
('ebdab0ab-b195-11f0-bf91-36124cea2420', 30, '2025-10-05 14:00:00', '栃木SC', '北九州', 2, 2, 'AWAY', '栃木県グリーンスタジアム', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025100519.html', NOW(), NOW()),
('ebdb53ab-b195-11f0-bf91-36124cea2420', 29, '2025-09-27 18:00:00', '北九州', '高知', 1, 0, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025092716.html', NOW(), NOW());
