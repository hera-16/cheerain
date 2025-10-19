'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface UserData {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Firestoreからユーザー情報を取得
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          console.log('🔍 [AuthContext] ユーザー認証状態:', {
            uid: user.uid,
            email: user.email,
            docExists: userDocSnap.exists()
          });

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            console.log('📄 [AuthContext] Firestoreデータ:', data);

            const userData = {
              userId: data.userId,
              email: data.email,
              role: data.role || 'user', // デフォルトはuser
              createdAt: data.createdAt?.toDate() || new Date(),
            };

            console.log('✅ [AuthContext] 設定されたuserData:', userData);
            console.log('👑 [AuthContext] isAdmin判定:', userData.role === 'admin');

            setUserData(userData);
          } else {
            console.warn('⚠️ [AuthContext] Firestoreにユーザードキュメントが存在しません');
            setUserData(null);
          }
        } catch (error) {
          console.error('❌ [AuthContext] ユーザー情報の取得エラー:', error);
          setUserData(null);
        }
      } else {
        console.log('🚪 [AuthContext] ユーザーがログアウトしました');
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
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
