'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // ユーザーIDの重複チェックは省略（後で必要なら追加）
        if (!userId.trim()) {
          setError('ユーザーIDを入力してください');
          setLoading(false);
          return;
        }

        // Firebase Authenticationでアカウント作成
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Firestoreにユーザー情報を保存
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          userId: userId.trim(),
          email: email,
          role: 'user', // デフォルトはuser権限
          createdAt: new Date(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/mypage');
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100">
      {/* ヘッダー */}
      <header className="bg-red-700 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-yellow-300 cursor-pointer hover:text-yellow-200 transition tracking-wider">CHEERAIN</h1>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Link
              href="/nfts"
              className="px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide"
            >
              NFT一覧
            </Link>
            <Link
              href="/mypage"
              className="px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide"
            >
              マイページ
            </Link>
          </nav>
        </div>
      </header>

      {/* ログインフォーム */}
      <div className="flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl p-8 w-full max-w-md border-4 border-red-700">
          <h2 className="text-3xl font-black text-center mb-2 text-red-700 tracking-wider">
            CHEERAIN
          </h2>
          <p className="text-center text-gray-700 mb-8 font-bold">
            {isSignUp ? 'アカウント作成' : 'ログイン'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="userId" className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
                  ユーザーID
                </label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required={isSignUp}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-red-700 outline-none transition font-medium text-gray-900"
                  placeholder="user123"
                  minLength={3}
                />
                <p className="text-xs text-gray-600 mt-1 font-medium">3文字以上で入力してください</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-red-700 outline-none transition font-medium text-gray-900"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-red-700 outline-none transition font-medium text-gray-900"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-700 text-red-900 px-4 py-3 text-sm font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-yellow-300 py-3 font-black hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-2 border-yellow-400 tracking-wider"
            >
              {loading ? '処理中...' : isSignUp ? 'アカウント作成' : 'ログイン'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-red-700 hover:text-red-900 text-sm font-bold tracking-wide underline"
            >
              {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : 'アカウントを作成'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
