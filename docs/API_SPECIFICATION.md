# REST API エンドポイント仕様書

## ベースURL
```
http://localhost:8080/api/v1
```

本番環境:
```
https://api.cheerain.com/api/v1
```

---

## 認証方式

### JWT (JSON Web Token) 認証
- ログイン成功時にJWTトークンを発行
- 以降のリクエストでは`Authorization`ヘッダーにトークンを含める

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## 共通レスポンス形式

### 成功時
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

### エラー時
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  }
}
```

---

## エンドポイント一覧

### 1. 認証関連 (Authentication)

#### 1.1 ユーザー登録
**POST** `/auth/register`

**リクエストボディ:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user_abc123",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2025-10-25T12:00:00Z"
  },
  "message": "ユーザー登録が完了しました"
}
```

**エラーコード:**
- `EMAIL_ALREADY_EXISTS`: メールアドレスが既に登録済み
- `INVALID_EMAIL`: メールアドレス形式が不正
- `WEAK_PASSWORD`: パスワードが脆弱

---

#### 1.2 ログイン
**POST** `/auth/login`

**リクエストボディ:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "user_abc123",
      "email": "user@example.com",
      "role": "user"
    }
  },
  "message": "ログインに成功しました"
}
```

**エラーコード:**
- `INVALID_CREDENTIALS`: メールアドレスまたはパスワードが間違っています
- `ACCOUNT_LOCKED`: アカウントがロックされています

---

#### 1.3 ログアウト
**POST** `/auth/logout`

**ヘッダー:**
```
Authorization: Bearer <JWT_TOKEN>
```

**レスポンス:**
```json
{
  "success": true,
  "message": "ログアウトしました"
}
```

---

#### 1.4 現在のユーザー情報取得
**GET** `/auth/me`

**ヘッダー:**
```
Authorization: Bearer <JWT_TOKEN>
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user_abc123",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2025-10-25T12:00:00Z"
  }
}
```

---

### 2. NFT関連

#### 2.1 NFT発行
**POST** `/nfts`

**ヘッダー:**
```
Authorization: Bearer <JWT_TOKEN>
```

**リクエストボディ:**
```json
{
  "title": "次の試合も頑張って！",
  "message": "いつも応援しています。次の試合も勝利を目指して頑張ってください！",
  "playerName": "田中太郎",
  "imageUrl": "https://storage.firebase.com/...",
  "paymentAmount": 1000,
  "paymentMethod": "credit",
  "venueId": "12345"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "title": "次の試合も頑張って！",
    "message": "いつも応援しています...",
    "playerName": "田中太郎",
    "imageUrl": "https://storage.firebase.com/...",
    "creatorUid": "550e8400-e29b-41d4-a716-446655440000",
    "creatorUserId": "user_abc123",
    "paymentAmount": 1000,
    "paymentMethod": "credit",
    "venueId": "12345",
    "isVenueAttendee": true,
    "createdAt": "2025-10-25T12:30:00Z"
  },
  "message": "NFTを発行しました"
}
```

**エラーコード:**
- `INVALID_PAYMENT_AMOUNT`: 支払金額が500円未満
- `INVALID_VENUE_ID`: 会場IDが不正（5桁の数字ではない）
- `UNAUTHORIZED`: 認証が必要

---

#### 2.2 NFT一覧取得
**GET** `/nfts`

**クエリパラメータ:**
- `page` (number, default: 0): ページ番号
- `size` (number, default: 20): 1ページあたりの件数
- `playerName` (string, optional): 選手名でフィルタ
- `creatorUid` (string, optional): 作成者でフィルタ

**例:**
```
GET /nfts?page=0&size=20&playerName=田中太郎
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "nfts": [
      {
        "id": "650e8400-e29b-41d4-a716-446655440001",
        "title": "次の試合も頑張って！",
        "message": "いつも応援しています...",
        "playerName": "田中太郎",
        "imageUrl": "https://storage.firebase.com/...",
        "creatorUserId": "user_abc123",
        "paymentAmount": 1000,
        "isVenueAttendee": true,
        "createdAt": "2025-10-25T12:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 0,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

---

#### 2.3 特定NFT取得
**GET** `/nfts/{nftId}`

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "title": "次の試合も頑張って！",
    "message": "いつも応援しています...",
    "playerName": "田中太郎",
    "imageUrl": "https://storage.firebase.com/...",
    "creatorUserId": "user_abc123",
    "creatorEmail": "user@example.com",
    "paymentAmount": 1000,
    "paymentMethod": "credit",
    "venueId": "12345",
    "isVenueAttendee": true,
    "createdAt": "2025-10-25T12:30:00Z"
  }
}
```

**エラーコード:**
- `NFT_NOT_FOUND`: NFTが見つかりません

---

#### 2.4 ユーザーが発行したNFT一覧
**GET** `/users/{userId}/nfts`

**ヘッダー:**
```
Authorization: Bearer <JWT_TOKEN>
```

**クエリパラメータ:**
- `page` (number, default: 0)
- `size` (number, default: 20)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "nfts": [ ... ],
    "pagination": { ... }
  }
}
```

---

### 3. 選手関連

#### 3.1 選手一覧取得
**GET** `/players`

**クエリパラメータ:**
- `isActive` (boolean, default: true): 在籍中の選手のみ取得

**レスポンス:**
```json
{
  "success": true,
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "田中太郎",
      "number": 10,
      "position": "MF",
      "isActive": true
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440002",
      "name": "山田次郎",
      "number": 9,
      "position": "FW",
      "isActive": true
    }
  ]
}
```

---

#### 3.2 選手作成（管理者のみ）
**POST** `/players`

**ヘッダー:**
```
Authorization: Bearer <JWT_TOKEN>
```

**リクエストボディ:**
```json
{
  "name": "田中太郎",
  "number": 10,
  "position": "MF",
  "isActive": true
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "name": "田中太郎",
    "number": 10,
    "position": "MF",
    "isActive": true,
    "createdAt": "2025-10-25T12:00:00Z"
  },
  "message": "選手を登録しました"
}
```

**エラーコード:**
- `FORBIDDEN`: 管理者権限が必要
- `DUPLICATE_NUMBER`: 背番号が重複しています

---

#### 3.3 選手更新（管理者のみ）
**PUT** `/players/{playerId}`

**ヘッダー:**
```
Authorization: Bearer <JWT_TOKEN>
```

**リクエストボディ:**
```json
{
  "name": "田中太郎",
  "number": 10,
  "position": "MF",
  "isActive": false
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "name": "田中太郎",
    "number": 10,
    "position": "MF",
    "isActive": false,
    "updatedAt": "2025-10-25T13:00:00Z"
  },
  "message": "選手情報を更新しました"
}
```

---

### 4. 管理者機能

#### 4.1 全ユーザー一覧（管理者のみ）
**GET** `/admin/users`

**ヘッダー:**
```
Authorization: Bearer <JWT_TOKEN>
```

**クエリパラメータ:**
- `page` (number, default: 0)
- `size` (number, default: 50)

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "userId": "user_abc123",
        "email": "user@example.com",
        "role": "user",
        "createdAt": "2025-10-25T12:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

**エラーコード:**
- `FORBIDDEN`: 管理者権限が必要

---

#### 4.2 ユーザー権限変更（管理者のみ）
**PATCH** `/admin/users/{userId}/role`

**ヘッダー:**
```
Authorization: Bearer <JWT_TOKEN>
```

**リクエストボディ:**
```json
{
  "role": "admin"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user_abc123",
    "email": "user@example.com",
    "role": "admin",
    "updatedAt": "2025-10-25T14:00:00Z"
  },
  "message": "ユーザー権限を更新しました"
}
```

---

#### 4.3 分析データ取得（管理者のみ）
**GET** `/admin/analytics`

**ヘッダー:**
```
Authorization: Bearer <JWT_TOKEN>
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1523,
    "totalNfts": 4567,
    "totalRevenue": 2345000,
    "venueAttendees": 234,
    "topPlayers": [
      {
        "playerName": "田中太郎",
        "nftCount": 456,
        "totalAmount": 456000
      }
    ],
    "recentNfts": [ ... ]
  }
}
```

---

### 5. 会場関連

#### 5.1 会場ID検証
**POST** `/venues/validate`

**リクエストボディ:**
```json
{
  "venueId": "12345"
}
```

**レスポンス:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "venueName": "ミクニワールドスタジアム北九州",
    "matchDate": "2025-11-01",
    "opponent": "FC東京"
  }
}
```

**エラー時:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_VENUE_ID",
    "message": "会場IDが無効です"
  }
}
```

---

## HTTPステータスコード

| コード | 意味 | 使用例 |
|--------|------|--------|
| 200 | OK | 正常なGET/PUT/PATCHリクエスト |
| 201 | Created | 正常なPOSTリクエスト（リソース作成） |
| 400 | Bad Request | リクエストパラメータが不正 |
| 401 | Unauthorized | 認証が必要 |
| 403 | Forbidden | 権限不足 |
| 404 | Not Found | リソースが見つからない |
| 409 | Conflict | リソースの重複（メールアドレス等） |
| 500 | Internal Server Error | サーバー内部エラー |

---

## セキュリティヘッダー

全てのレスポンスに以下のヘッダーを含める:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## CORS設定

開発環境:
```
Access-Control-Allow-Origin: http://localhost:3000
```

本番環境:
```
Access-Control-Allow-Origin: https://cheerain.com
```

---

## レート制限

- 認証エンドポイント: 5リクエスト/分
- その他のエンドポイント: 100リクエスト/分

レート制限超過時:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト制限を超えました。しばらくしてから再試行してください。"
  }
}
```

---

## 次のステップ

1. ✅ API仕様書作成完了
2. ⬜ Spring Bootプロジェクト作成
3. ⬜ JPAエンティティ実装
4. ⬜ REST Controllerの実装
5. ⬜ JWT認証の実装
6. ⬜ フロントエンドのAPI呼び出しコード作成
