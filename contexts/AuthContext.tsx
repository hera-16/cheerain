'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface UserData {
  id: string;
  userId: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: UserData | null;
  userData: UserData | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAdmin: false,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    if (token) {
      // トークンがある場合、現在のユーザー情報を取得
      const fetchUser = async () => {
        try {
          const response = await api.get<UserData>('/auth/me');

          if (response.success && response.data) {
            console.log('✅ [AuthContext] ユーザー情報取得成功:', response.data);
            setUser(response.data);
            setUserData(response.data);
          }
        } catch (error) {
          console.error('❌ [AuthContext] ユーザー情報取得エラー:', error);
          // トークンが無効な場合はログアウト
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
          setUser(null);
          setUserData(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      console.log('🚪 [AuthContext] トークンが存在しません');
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // localStorageからトークンを削除
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      setUser(null);
      setUserData(null);
      router.push('/login');
    }
  };

  const isAdmin = userData?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, userData, isAdmin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
