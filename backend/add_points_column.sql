-- ユーザーテーブルにポイントカラムを追加
ALTER TABLE users ADD COLUMN points INT NOT NULL DEFAULT 0;

-- 既存ユーザーに初期ポイント0を設定（既にDEFAULT 0があるため不要だが念のため）
UPDATE users SET points = 0 WHERE points IS NULL;
