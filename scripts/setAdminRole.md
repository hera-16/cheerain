# Admin権限の設定方法

## 方法1: Firebaseコンソール（推奨）

### 手順

1. **Firebaseコンソールにアクセス**
   - https://console.firebase.google.com/
   - プロジェクトを選択

2. **Firestoreデータベースを開く**
   - 左メニュー → "Firestore Database"
   - "データ" タブを選択

3. **usersコレクションを開く**
   - `users` コレクションをクリック

4. **対象ユーザーを選択**
   - Admin権限を付与したいユーザーのドキュメント（UID）をクリック

5. **roleフィールドを編集**

   **既存のroleフィールドがある場合:**
   - `role` フィールドをクリック
   - 値を `admin` に変更
   - "更新" をクリック

   **roleフィールドがない場合:**
   - "フィールドを追加" をクリック
   - フィールド名: `role`
   - タイプ: `string`
   - 値: `admin`
   - "追加" をクリック

6. **確認**
   - ユーザーが再ログインすると、Admin権限が適用されます
   - `/admin` にアクセスできるようになります

---

## 方法2: 既存ユーザーのメールアドレスで判定

開発環境で特定のメールアドレスを自動的にAdminにする場合：

### `contexts/AuthContext.tsx` に条件追加（開発用）

```typescript
// 例: 特定のメールアドレスを自動的にAdminとする
const adminEmails = ['admin@example.com', 'your-email@gmail.com'];

if (userDocSnap.exists()) {
  const data = userDocSnap.data();
  setUserData({
    userId: data.userId,
    email: data.email,
    role: adminEmails.includes(user.email || '') ? 'admin' : (data.role || 'user'),
    createdAt: data.createdAt?.toDate() || new Date(),
  });
}
```

⚠️ **注意**: この方法は開発環境のみで使用してください。本番環境では必ずFirestoreのデータで管理してください。

---

## 方法3: 初回Adminユーザー作成用スクリプト（高度）

Firebaseコンソールにアクセスできない場合、以下の手順でスクリプトを実行：

### 1. `scripts/createAdmin.ts` を作成

```typescript
import admin from 'firebase-admin';
import * as readline from 'readline';

// Firebase Admin SDKの初期化
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setAdminRole() {
  rl.question('Admin権限を付与するユーザーのメールアドレスを入力: ', async (email) => {
    try {
      // Authenticationからユーザーを検索
      const userRecord = await admin.auth().getUserByEmail(email);

      // Firestoreのroleを更新
      await db.collection('users').doc(userRecord.uid).update({
        role: 'admin'
      });

      console.log(`✅ ユーザー「${email}」にAdmin権限を付与しました`);
    } catch (error) {
      console.error('❌ エラー:', error);
    } finally {
      rl.close();
      process.exit();
    }
  });
}

setAdminRole();
```

### 2. 実行

```bash
npm install firebase-admin
npx ts-node scripts/createAdmin.ts
```

⚠️ **注意**: この方法はFirebase Admin SDKのサービスアカウントキーが必要です。

---

## おすすめの方法

**開発環境**: 方法1（Firebaseコンソール）が最も簡単で安全
**本番環境**: 方法1（Firebaseコンソール）またはAdmin画面から権限変更

---

## Admin権限の確認方法

1. Admin権限を設定したユーザーでログイン
2. ブラウザのコンソールで以下を実行:
   ```javascript
   // AuthContextの状態を確認
   console.log('isAdmin:', /* isAdminの値 */);
   ```
3. `/admin` にアクセスして、リダイレクトされないことを確認
4. ダッシュボードが表示されればOK

---

## トラブルシューティング

### Admin画面にアクセスできない

1. **ログアウト→再ログイン**
   - AuthContextはログイン時にユーザーデータを取得します
   - 権限を変更したら必ず再ログインしてください

2. **Firestoreのroleフィールドを確認**
   - 値が正確に `admin` (小文字)になっているか確認
   - タイプが `string` になっているか確認

3. **ブラウザのキャッシュをクリア**
   - F12 → Application → Clear storage

4. **コンソールでエラーを確認**
   - F12 → Console タブでエラーメッセージを確認

---

## 現在のAdmin機能

- ✅ ダッシュボード（統計表示）
- ✅ ユーザー管理（一覧・検索・権限変更・削除）
- ✅ NFT管理（一覧・検索・フィルター・削除）
- ✅ 分析（選手別・支払方法別・日別統計）

Admin画面URL: `http://localhost:3000/admin`
