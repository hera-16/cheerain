-- Cheerain データベースセットアップスクリプト

-- データベース作成
CREATE DATABASE IF NOT EXISTS cheerain
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- データベース選択
USE cheerain;

-- テーブルは Spring Boot の JPA が自動作成します (ddl-auto=update)
-- このスクリプトではデータベースの作成のみ行います

-- 確認用クエリ
SHOW DATABASES LIKE 'cheerain';
