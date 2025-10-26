'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface VenueCode {
  id: string;
  code: string;
  venueName: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
}

export default function VenueCodesPage() {
  const [venueCodes, setVenueCodes] = useState<VenueCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenueCodes();
  }, []);

  const fetchVenueCodes = async () => {
    try {
      setLoading(true);
      const response = await api.get<VenueCode[]>('/venue-codes');
      setVenueCodes(response.data || []);
    } catch (error) {
      console.error('現地コード取得エラー:', error);
      alert('現地コードの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この現地コードを削除しますか?')) return;

    try {
      await api.delete(`/venue-codes/${id}`);
      alert('現地コードを削除しました');
      fetchVenueCodes();
    } catch (error) {
      console.error('削除エラー:', error);
      alert('現地コードの削除に失敗しました');
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">現地コード管理</h1>
          <a
            href="/admin"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← ダッシュボードに戻る
          </a>
        </div>

        {/* 現地コード一覧 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  コード
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  会場名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  有効期限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {venueCodes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    現地コードがありません
                  </td>
                </tr>
              ) : (
                venueCodes.map((code) => (
                  <tr key={code.id} className={isExpired(code.expiresAt) ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-gray-900">{code.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{code.venueName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{code.createdBy}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(code.createdAt).toLocaleString('ja-JP')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(code.expiresAt).toLocaleString('ja-JP')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isExpired(code.expiresAt) ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          期限切れ
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          有効
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(code.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
