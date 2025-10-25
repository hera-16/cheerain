# フロントエンド API連携ガイド

## 概要
このドキュメントは、Next.jsフロントエンド開発者向けに、Firebase呼び出しをREST API呼び出しに変更する手順を説明します。

---

## 前提条件

### 必要な環境変数
`.env.local` に以下を追加:

```env
# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# 本番環境
# NEXT_PUBLIC_API_BASE_URL=https://api.cheerain.com/api/v1
```

---

## APIクライアントの作成

### 1. API用のutilityファイルを作成

**ファイル:** `lib/api.ts`

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * APIレスポンスの型定義
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

/**
 * HTTPリクエストを実行するヘルパー関数
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // JWTトークンをlocalStorageから取得
  const token = localStorage.getItem('authToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // トークンがあればAuthorizationヘッダーに追加
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'リクエストに失敗しました');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * APIクライアント
 */
export const api = {
  // GET
  get: <T>(endpoint: string) => fetchApi<T>(endpoint, { method: 'GET' }),

  // POST
  post: <T>(endpoint: string, body: any) =>
    fetchApi<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // PUT
  put: <T>(endpoint: string, body: any) =>
    fetchApi<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // PATCH
  patch: <T>(endpoint: string, body: any) =>
    fetchApi<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  // DELETE
  delete: <T>(endpoint: string) =>
    fetchApi<T>(endpoint, { method: 'DELETE' }),
};
```

---

## 移行手順

### 手順1: 認証機能の移行

#### Before（Firebase）
**ファイル:** `app/login/page.tsx`

```typescript
// 旧コード（Firebase）
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const handleRegister = async () => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    userId: `user_${Date.now()}`,
    email: email,
    role: 'user',
    createdAt: serverTimestamp(),
  });
};

const handleLogin = async () => {
  await signInWithEmailAndPassword(auth, email, password);
};
```

#### After（REST API）
**ファイル:** `app/login/page.tsx`

```typescript
// 新コード（REST API）
import { api } from '@/lib/api';

interface RegisterResponse {
  id: string;
  userId: string;
  email: string;
  role: string;
  createdAt: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    userId: string;
    email: string;
    role: string;
  };
}

const handleRegister = async () => {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', {
      email,
      password,
    });

    if (response.success) {
      alert('登録が完了しました。ログインしてください。');
    }
  } catch (error) {
    console.error('登録エラー:', error);
    alert('登録に失敗しました');
  }
};

const handleLogin = async () => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    if (response.success && response.data) {
      // JWTトークンをlocalStorageに保存
      localStorage.setItem('authToken', response.data.token);

      // ユーザー情報も保存（オプション）
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // マイページにリダイレクト
      router.push('/mypage');
    }
  } catch (error) {
    console.error('ログインエラー:', error);
    alert('ログインに失敗しました');
  }
};
```

---

### 手順2: AuthContextの移行

#### Before（Firebase）
**ファイル:** `contexts/AuthContext.tsx`

```typescript
// 旧コード（Firebase）
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      // ...
    }
  });
  return unsubscribe;
}, []);
```

#### After（REST API）
**ファイル:** `contexts/AuthContext.tsx`

```typescript
// 新コード（REST API）
import { api } from '@/lib/api';

interface UserData {
  id: string;
  userId: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

useEffect(() => {
  const token = localStorage.getItem('authToken');

  if (token) {
    // トークンがある場合、現在のユーザー情報を取得
    const fetchUser = async () => {
      try {
        const response = await api.get<UserData>('/auth/me');

        if (response.success && response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('ユーザー情報取得エラー:', error);
        // トークンが無効な場合はログアウト
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  } else {
    setLoading(false);
  }
}, []);

const logout = async () => {
  try {
    await api.post('/auth/logout', {});
  } catch (error) {
    console.error('ログアウトエラー:', error);
  } finally {
    // localStorageからトークンを削除
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUserData(null);
    router.push('/login');
  }
};
```

---

### 手順3: NFT発行機能の移行

#### Before（Firebase）
**ファイル:** `components/NFTMintForm.tsx`

```typescript
// 旧コード（Firebase）
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadImage, generateFileName } from '@/lib/uploadImage';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Firebase Storageに画像アップロード
  const fileName = generateFileName(formData.image.name);
  const storagePath = `nfts/${user.uid}/${fileName}`;
  const imageUrl = await uploadImage(formData.image, storagePath);

  // Firestoreに保存
  await addDoc(collection(db, 'nfts'), {
    title: formData.title,
    message: formData.message,
    playerName: formData.playerName,
    imageUrl: imageUrl,
    creatorUid: user.uid,
    paymentAmount: parseFloat(paymentAmount),
    paymentMethod: paymentMethod,
    venueId: venueId || null,
    isVenueAttendee: venueId ? true : false,
    createdAt: serverTimestamp(),
  });
};
```

#### After（REST API）
**ファイル:** `components/NFTMintForm.tsx`

```typescript
// 新コード（REST API）
import { api } from '@/lib/api';

interface NftResponse {
  id: string;
  title: string;
  message: string;
  playerName: string;
  imageUrl: string;
  creatorUid: string;
  creatorUserId: string;
  paymentAmount: number;
  paymentMethod: string;
  venueId: string | null;
  isVenueAttendee: boolean;
  createdAt: string;
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 画像アップロードは引き続きFirebase Storageを使用
    // （またはバックエンドに画像アップロードAPIを追加）
    let imageUrl = '';
    if (formData.image) {
      const fileName = generateFileName(formData.image.name);
      const storagePath = `nfts/${userData.id}/${fileName}`;
      imageUrl = await uploadImage(formData.image, storagePath);
    }

    // REST APIでNFTを発行
    const response = await api.post<NftResponse>('/nfts', {
      title: formData.title,
      message: formData.message,
      playerName: formData.playerName,
      imageUrl: imageUrl,
      paymentAmount: parseFloat(paymentAmount),
      paymentMethod: paymentMethod,
      venueId: venueId || null,
    });

    if (response.success) {
      alert('NFTを発行しました！');
      // フォームリセット
      setFormData({ title: '', message: '', playerName: '', image: null });
    }
  } catch (error) {
    console.error('NFT発行エラー:', error);
    alert('NFTの発行に失敗しました');
  }
};
```

---

### 手順4: NFT一覧取得の移行

#### Before（Firebase）
**ファイル:** `components/NFTGallery.tsx`

```typescript
// 旧コード（Firebase）
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

useEffect(() => {
  const fetchNFTs = async () => {
    const q = query(
      collection(db, 'nfts'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);
    const nftsList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNfts(nftsList);
  };

  fetchNFTs();
}, []);
```

#### After（REST API）
**ファイル:** `components/NFTGallery.tsx`

```typescript
// 新コード（REST API）
import { api } from '@/lib/api';

interface NftData {
  id: string;
  title: string;
  message: string;
  playerName: string;
  imageUrl: string;
  creatorUserId: string;
  paymentAmount: number;
  isVenueAttendee: boolean;
  createdAt: string;
}

interface NftListResponse {
  nfts: NftData[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

useEffect(() => {
  const fetchNFTs = async () => {
    try {
      const response = await api.get<NftListResponse>('/nfts?page=0&size=20');

      if (response.success && response.data) {
        setNfts(response.data.nfts);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('NFT取得エラー:', error);
    }
  };

  fetchNFTs();
}, []);
```

---

### 手順5: 選手一覧取得の移行

#### Before（Firebase）
**ファイル:** `components/NFTMintForm.tsx`

```typescript
// 旧コード（Firebase）
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

useEffect(() => {
  const fetchPlayers = async () => {
    const snapshot = await getDocs(collection(db, 'players'));
    const playersList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const activePlayers = playersList
      .filter(p => p.isActive)
      .sort((a, b) => a.number - b.number);

    setPlayers(activePlayers);
  };

  fetchPlayers();
}, []);
```

#### After（REST API）
**ファイル:** `components/NFTMintForm.tsx`

```typescript
// 新コード（REST API）
import { api } from '@/lib/api';

interface PlayerData {
  id: string;
  name: string;
  number: number;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  isActive: boolean;
}

useEffect(() => {
  const fetchPlayers = async () => {
    try {
      const response = await api.get<PlayerData[]>('/players?isActive=true');

      if (response.success && response.data) {
        // バックエンドで既にソート済みの想定
        setPlayers(response.data);
      }
    } catch (error) {
      console.error('選手データ取得エラー:', error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  fetchPlayers();
}, []);
```

---

## 画像アップロードについて

### オプション1: 引き続きFirebase Storageを使用
現在の `uploadImage()` 関数をそのまま利用可能。

### オプション2: バックエンドに画像アップロードAPIを追加
Spring Bootで画像アップロード用のエンドポイントを作成:

**POST** `/upload/image`

```typescript
const uploadImageToBackend = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data.data.imageUrl; // アップロードされた画像のURL
};
```

---

## 削除すべきファイル（Firebase不要になった場合）

移行が完了したら、以下のファイルを削除できます:

1. `lib/firebase.ts` - Firebase初期化ファイル
2. `lib/uploadImage.ts` - Firebase Storage使う場合は保持
3. `.env.local`のFirebase関連環境変数

```env
# 削除可能
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ...
```

---

## トラブルシューティング

### 1. CORS エラー
バックエンド（Spring Boot）側で CORS設定を確認:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 2. 認証エラー
- JWTトークンが正しく保存されているか確認
- トークンの有効期限を確認
- ブラウザのlocalStorageを確認

```javascript
// デバッグ用
console.log('Token:', localStorage.getItem('authToken'));
```

### 3. 日付フォーマットの違い
Firebaseの`Timestamp`型からISO 8601形式（文字列）に変更:

```typescript
// Before: Firebaseの場合
createdAt.toDate()

// After: REST APIの場合
new Date(createdAt) // ISO 8601文字列をDateオブジェクトに変換
```

---

## チェックリスト

- [ ] `.env.local`にAPI Base URLを追加
- [ ] `lib/api.ts`を作成
- [ ] ログイン機能を移行
- [ ] ユーザー登録機能を移行
- [ ] `AuthContext`を移行
- [ ] NFT発行機能を移行
- [ ] NFT一覧取得を移行
- [ ] 選手一覧取得を移行
- [ ] マイページのNFT取得を移行
- [ ] 管理画面のAPI呼び出しを移行
- [ ] 画像アップロード方針を決定
- [ ] 全ての機能をテスト

---

## 次のステップ

1. バックエンド開発者: Java + MySQLでAPIサーバーを実装
2. フロントエンド開発者: このガイドに従ってFirebase呼び出しをAPI呼び出しに変更
3. 両者で協力してAPI連携のテストを実施
