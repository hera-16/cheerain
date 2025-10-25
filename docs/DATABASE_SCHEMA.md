# MySQL データベーススキーマ設計書

## 概要
Cheerain（応援NFTアプリ）のデータベース設計書
Firebase Firestore から MySQL への移行用

---

## テーブル一覧

### 1. users（ユーザー）
ユーザーアカウント情報を管理

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,           -- UUID
    user_id VARCHAR(50) UNIQUE NOT NULL,  -- ユーザー表示ID（例: user_abc123）
    email VARCHAR(255) UNIQUE NOT NULL,   -- メールアドレス
    password_hash VARCHAR(255) NOT NULL,  -- パスワードハッシュ（BCrypt推奨）
    role ENUM('user', 'admin') DEFAULT 'user', -- ロール
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**フィールド説明:**
- `id`: 内部UUID（主キー）
- `user_id`: ユーザー向け表示ID
- `email`: ログイン用メールアドレス
- `password_hash`: BCryptでハッシュ化されたパスワード
- `role`: `user`（一般ユーザー）または `admin`（管理者）
- `created_at`: アカウント作成日時
- `updated_at`: 最終更新日時

---

### 2. nfts（NFT応援カード）
発行されたNFT応援カードを管理

```sql
CREATE TABLE nfts (
    id VARCHAR(36) PRIMARY KEY,              -- UUID
    title VARCHAR(255) NOT NULL,             -- タイトル
    message TEXT NOT NULL,                   -- 応援メッセージ
    player_name VARCHAR(100) NOT NULL,       -- 応援する選手名
    image_url TEXT,                          -- 画像URL（Firebase Storage または S3）
    creator_uid VARCHAR(36) NOT NULL,        -- 作成者のユーザーID（FK）
    creator_user_id VARCHAR(50) NOT NULL,    -- 作成者の表示ID
    creator_email VARCHAR(255) NOT NULL,     -- 作成者のメールアドレス（表示用）
    payment_amount DECIMAL(10, 2) NOT NULL,  -- 支払金額
    payment_method ENUM('credit', 'paypay', 'aupay') NOT NULL, -- 支払方法
    venue_id VARCHAR(5),                     -- 会場ID（5桁、任意）
    is_venue_attendee BOOLEAN DEFAULT FALSE, -- 現地参加フラグ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_uid) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_creator_uid (creator_uid),
    INDEX idx_player_name (player_name),
    INDEX idx_created_at (created_at),
    INDEX idx_venue_id (venue_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**フィールド説明:**
- `id`: NFT一意識別子（UUID）
- `title`: NFTタイトル
- `message`: 応援メッセージ本文
- `player_name`: 応援対象の選手名（または「チームを応援」）
- `image_url`: 画像の保存先URL（Firebase Storage等）
- `creator_uid`: 作成者のユーザーID（外部キー）
- `payment_amount`: 支払金額（円）
- `payment_method`: 支払方法（クレジット、PayPay、auPay）
- `venue_id`: 会場で掲示されている5桁のID（現地参加の証明）
- `is_venue_attendee`: 現地参加サポーターフラグ

---

### 3. players（選手）
ギラヴァンツ北九州の選手情報

```sql
CREATE TABLE players (
    id VARCHAR(36) PRIMARY KEY,          -- UUID
    name VARCHAR(100) NOT NULL,          -- 選手名
    number INT NOT NULL,                 -- 背番号
    position ENUM('GK', 'DF', 'MF', 'FW') NOT NULL, -- ポジション
    is_active BOOLEAN DEFAULT TRUE,      -- 在籍中フラグ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_number (number),
    INDEX idx_position (position),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**フィールド説明:**
- `id`: 選手ID（UUID）
- `name`: 選手名
- `number`: 背番号
- `position`: ポジション（GK, DF, MF, FW）
- `is_active`: 現在チームに在籍しているか

---

### 4. venues（会場）
試合会場の情報管理（会場ID発行用）

```sql
CREATE TABLE venues (
    id VARCHAR(36) PRIMARY KEY,           -- UUID
    venue_id VARCHAR(5) UNIQUE NOT NULL,  -- 5桁の会場ID
    venue_name VARCHAR(255) NOT NULL,     -- 会場名
    match_date DATE NOT NULL,             -- 試合日
    opponent VARCHAR(100),                -- 対戦相手
    is_active BOOLEAN DEFAULT TRUE,       -- 有効フラグ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_venue_id (venue_id),
    INDEX idx_match_date (match_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**フィールド説明:**
- `venue_id`: 会場で掲示される5桁のID（例: 12345）
- `venue_name`: 会場名（例: ミクニワールドスタジアム北九州）
- `match_date`: 試合開催日
- `opponent`: 対戦相手チーム名
- `is_active`: 現在使用中かどうか

---

## データ型の選択理由

### UUID（VARCHAR(36)）
- Firebase の自動生成IDの代わりに UUID v4 を使用
- JavaではUUID.randomUUID()で生成可能

### TIMESTAMP vs DATETIME
- `TIMESTAMP`を使用（自動的にUTCで保存、タイムゾーン対応）
- Firestoreの`serverTimestamp()`と同等の機能

### ENUM型
- `role`, `payment_method`, `position` などの固定値
- データ整合性の向上とストレージ効率化

### TEXT vs VARCHAR
- `message`（長文）: TEXT型
- `title`, `name`（短文）: VARCHAR型

---

## インデックス戦略

### 必須インデックス
1. **users**: `email`, `user_id`（ログイン・検索用）
2. **nfts**: `creator_uid`, `player_name`, `created_at`（フィルタ・ソート用）
3. **players**: `number`, `position`, `is_active`（選手一覧表示用）
4. **venues**: `venue_id`, `match_date`（会場ID検証用）

---

## 外部キー制約

### CASCADE削除
- ユーザー削除時、そのユーザーが発行したNFTも削除（`ON DELETE CASCADE`）
- データの整合性を保つため

---

## 初期データ（サンプル）

### 管理者ユーザー
```sql
INSERT INTO users (id, user_id, email, password_hash, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin_001', 'admin@cheerain.com', '$2a$10$...', 'admin');
```

### 選手データ（サンプル）
```sql
INSERT INTO players (id, name, number, position, is_active) VALUES
('650e8400-e29b-41d4-a716-446655440001', '田中太郎', 10, 'MF', TRUE),
('650e8400-e29b-41d4-a716-446655440002', '山田次郎', 9, 'FW', TRUE),
('650e8400-e29b-41d4-a716-446655440003', '佐藤三郎', 1, 'GK', TRUE);
```

---

## Firebaseからの移行マッピング

| Firestore コレクション | MySQL テーブル | 備考 |
|---------------------|--------------|------|
| `users` | `users` | `uid` → `id`（UUID） |
| `nfts` | `nfts` | `creatorUid` → `creator_uid` |
| `players` | `players` | そのまま移行 |
| N/A | `venues` | 新規追加（会場管理機能） |

---

## パフォーマンス最適化

### 推奨事項
1. **接続プール**: HikariCP（Spring Boot標準）
2. **クエリキャッシュ**: Redis導入を検討
3. **ページネーション**: LIMIT/OFFSETで実装
4. **フルテキスト検索**: `message`フィールドにFULLTEXT INDEX追加可能

```sql
-- フルテキスト検索用インデックス（オプション）
ALTER TABLE nfts ADD FULLTEXT INDEX idx_fulltext_message (message);
```

---

## セキュリティ考慮事項

### パスワード管理
- BCryptでハッシュ化（ストレングス10以上推奨）
- ソルトは自動生成

### SQLインジェクション対策
- PreparedStatementを必ず使用
- JPAのParameterizedQueryを活用

### 個人情報保護
- `email`は暗号化を検討（AES-256）
- GDPR対応: ユーザー削除時は完全削除（CASCADE）

---

## 次のステップ

1. ✅ スキーマ設計完了
2. ⬜ Java Spring BootでJPAエンティティ作成
3. ⬜ REST APIエンドポイント実装
4. ⬜ フロントエンドのFirebase呼び出しをAPI呼び出しに変更
