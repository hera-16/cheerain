'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface User {
  id: string;
  userId: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList: User[] = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        email: doc.data().email,
        role: doc.data().role || 'user',
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      // 作成日で降順ソート
      usersList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setUsers(usersList);
    } catch (error) {
      console.error('ユーザーリスト取得エラー:', error);
      alert('ユーザー情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    if (!confirm(`このユーザーの権限を「${newRole}」に変更しますか？`)) {
      return;
    }

    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
      });

      // ローカルステートを更新
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      alert(`権限を「${newRole}」に変更しました`);
    } catch (error) {
      console.error('権限変更エラー:', error);
      alert('権限の変更に失敗しました');
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`ユーザー「${userEmail}」を削除しますか？\nこの操作は取り消せません。`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));

      // ローカルステートを更新
      setUsers(users.filter(user => user.id !== userId));

      alert('ユーザーを削除しました');
    } catch (error) {
      console.error('ユーザー削除エラー:', error);
      alert('ユーザーの削除に失敗しました');
    }
  };

  const filteredUsers = users.filter(user =>
    user.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-black text-yellow-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* タイトル */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">👥</div>
        <h1 className="text-5xl font-black text-yellow-300 mb-4 tracking-wider">
          ユーザー管理
        </h1>
        <p className="text-xl text-gray-300 font-bold">
          全{users.length}名のユーザー
        </p>
      </div>

      {/* 検索バー */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ユーザーIDまたはメールアドレスで検索..."
            className="w-full pl-12 pr-4 py-3 border-4 border-red-600 bg-gray-800 text-yellow-300 placeholder-gray-500 focus:border-yellow-400 focus:outline-none font-bold text-lg"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-400 mt-2 font-medium">
            {filteredUsers.length}件のユーザーが見つかりました
          </p>
        )}
      </div>

      {/* ユーザーリスト */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-black text-yellow-300 mb-4">該当するユーザーが見つかりません</h3>
        </div>
      ) : (
        <div className="bg-gray-800 shadow-2xl border-4 border-red-600 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-300 uppercase tracking-wider">
                  ユーザーID
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-300 uppercase tracking-wider">
                  メールアドレス
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-300 uppercase tracking-wider">
                  権限
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-300 uppercase tracking-wider">
                  登録日
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-yellow-300">{user.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-300">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-black border-2 ${
                        user.role === 'admin'
                          ? 'bg-red-600 text-yellow-300 border-yellow-400'
                          : 'bg-gray-700 text-gray-300 border-gray-600'
                      }`}
                    >
                      {user.role === 'admin' ? '🔧 ADMIN' : '👤 USER'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400 font-medium">
                      {user.createdAt.toLocaleDateString('ja-JP')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleUserRole(user.id, user.role)}
                      className="mr-3 px-3 py-1 bg-blue-600 text-yellow-300 hover:bg-blue-700 transition font-bold border-2 border-blue-400"
                    >
                      {user.role === 'admin' ? 'User化' : 'Admin化'}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id, user.email)}
                      className="px-3 py-1 bg-red-600 text-yellow-300 hover:bg-red-700 transition font-bold border-2 border-red-400"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
