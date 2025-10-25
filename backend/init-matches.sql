-- 試合データの投入（UTF-8エンコーディング）
DELETE FROM matches;

INSERT INTO matches (id, round, match_date, home_team, away_team, home_score, away_score, location, stadium, competition, match_info_url, created_at, updated_at) VALUES
-- 2025年シーズン
('ebd8edab-b195-11f0-bf91-36124cea2420', 33, '2025-10-25 14:00:00', '北九州', '琉球', 2, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025102518.html', NOW(), NOW()),
('ebd96e1b-b195-11f0-bf91-36124cea2420', 32, '2025-10-19 14:00:00', '讃岐', '北九州', 1, 4, 'AWAY', '県立丸亀', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025101910.html', NOW(), NOW()),
('ebda1e4b-b195-11f0-bf91-36124cea2420', 31, '2025-10-11 14:00:00', '北九州', '鹿児島', 3, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025101119.html', NOW(), NOW()),
('ebdab0ab-b195-11f0-bf91-36124cea2420', 30, '2025-10-05 14:00:00', '栃木SC', '北九州', 2, 2, 'AWAY', '栃木県グリーンスタジアム', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025100519.html', NOW(), NOW()),
('ebdb53ab-b195-11f0-bf91-36124cea2420', 29, '2025-09-27 18:00:00', '北九州', '高知', 1, 0, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/live_2025092716.html', NOW(), NOW()),

-- 2024年シーズン
('2024-match-001', 34, '2024-11-24 13:00:00', '北九州', '沼津', 2, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-002', 33, '2024-11-17 13:00:00', '松本', '北九州', 1, 1, 'AWAY', 'サンプロアルウィン', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-003', 32, '2024-11-10 13:00:00', '北九州', '今治', 3, 2, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-004', 31, '2024-11-03 13:00:00', '奈良', '北九州', 0, 2, 'AWAY', 'ならでんフィールド', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-005', 30, '2024-10-27 14:00:00', '北九州', 'FC大阪', 1, 0, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-006', 29, '2024-10-20 14:00:00', '讃岐', '北九州', 2, 2, 'AWAY', '県立丸亀', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-007', 28, '2024-10-13 14:00:00', '北九州', 'カターレ富山', 3, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-008', 27, '2024-10-06 14:00:00', '福島', '北九州', 1, 3, 'AWAY', 'とうほう・みんなのスタジアム', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-009', 26, '2024-09-29 14:00:00', '北九州', '愛媛', 2, 0, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-010', 25, '2024-09-22 14:00:00', 'ガイナーレ鳥取', '北九州', 0, 1, 'AWAY', 'とりぎんバードスタジアム', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-011', 24, '2024-09-15 18:00:00', '北九州', '相模原', 2, 2, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-012', 23, '2024-09-08 14:00:00', 'Y.S.C.C.', '北九州', 1, 2, 'AWAY', 'ニッパツ三ツ沢球技場', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-013', 22, '2024-09-01 18:00:00', '北九州', '岩手', 1, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-014', 21, '2024-08-25 18:00:00', '宮崎', '北九州', 0, 0, 'AWAY', 'ひなたサンマリンスタジアム宮崎', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2024-match-015', 20, '2024-08-18 18:00:00', '北九州', '讃岐', 2, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),

-- 2023年シーズン
('2023-match-001', 34, '2023-11-26 13:00:00', '北九州', '今治', 1, 2, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-002', 33, '2023-11-19 13:00:00', '松本', '北九州', 2, 1, 'AWAY', 'サンプロアルウィン', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-003', 32, '2023-11-12 13:00:00', '北九州', '福島', 3, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-004', 31, '2023-11-05 13:00:00', '沼津', '北九州', 1, 1, 'AWAY', '愛鷹広域公園多目的競技場', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-005', 30, '2023-10-29 14:00:00', '北九州', 'カターレ富山', 2, 0, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-006', 29, '2023-10-22 14:00:00', '岩手', '北九州', 0, 2, 'AWAY', 'いわぎんスタジアム', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-007', 28, '2023-10-15 14:00:00', '北九州', 'FC大阪', 1, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-008', 27, '2023-10-08 14:00:00', '相模原', '北九州', 2, 3, 'AWAY', '相模原ギオンスタジアム', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-009', 26, '2023-10-01 14:00:00', '北九州', 'ガイナーレ鳥取', 2, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-010', 25, '2023-09-24 14:00:00', 'Y.S.C.C.', '北九州', 1, 1, 'AWAY', 'ニッパツ三ツ沢球技場', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-011', 24, '2023-09-17 14:00:00', '北九州', '讃岐', 1, 0, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-012', 23, '2023-09-10 14:00:00', '愛媛', '北九州', 2, 2, 'AWAY', 'ニンジニアスタジアム', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-013', 22, '2023-09-03 18:00:00', '北九州', '宮崎', 3, 0, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-014', 21, '2023-08-27 18:00:00', '奈良', '北九州', 1, 2, 'AWAY', 'ならでんフィールド', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW()),
('2023-match-015', 20, '2023-08-20 18:00:00', '北九州', '八戸', 2, 1, 'HOME', 'ミクスタ', 'J3リーグ', 'https://www.giravanz.jp/game/schedule.html', NOW(), NOW());

