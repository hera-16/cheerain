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
  uid?: string; // マイページとの互換性のため
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
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('✅ [AuthContext] localStorageからユーザー情報を復元:', parsedUser);
        setUser(parsedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error('❌ [AuthContext] ユーザー情報のパースエラー:', error);
        // パースに失敗したらクリア
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
        setUser(null);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('🚪 [AuthContext] トークンまたはユーザー情報が存在しません');
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
