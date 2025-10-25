'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Match {
  id: string;
  round: number;
  matchDate: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  location: string;
  stadium: string;
  competition: string;
  matchInfoUrl: string;
  result: string;
}

interface YearlyStats {
  year: number;
  totalViews: number;
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
}

export default function AdminMatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [yearlyStats, setYearlyStats] = useState<YearlyStats[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    fetchYearlyStats();
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [selectedYear]);

  const fetchYearlyStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/v1/matches/stats/yearly', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setYearlyStats(data.data);
        const years = data.data.map((stat: YearlyStats) => stat.year);
        setAvailableYears(years);
        if (years.length > 0 && !years.includes(selectedYear)) {
          setSelectedYear(years[0]);
        }
      }
    } catch (error) {
      console.error('年度別統計の取得に失敗:', error);
    }
  };

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/v1/matches', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        const filteredMatches = data.data.filter((match: Match) => {
          const year = new Date(match.matchDate).getFullYear();
          return year === selectedYear;
        });
        setMatches(filteredMatches);
      }
    } catch (error) {
      console.error('試合データの取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultBadge = (result: string) => {
    const badges = {
      WIN: 'bg-green-100 text-green-800',
      LOSE: 'bg-red-100 text-red-800',
      DRAW: 'bg-yellow-100 text-yellow-800',
      SCHEDULED: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      WIN: '勝',
      LOSE: '負',
      DRAW: '分',
      SCHEDULED: '未実施',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${badges[result as keyof typeof badges]}`}>
        {labels[result as keyof typeof labels]}
      </span>
    );
  };

  const currentYearStat = yearlyStats.find(stat => stat.year === selectedYear);

  if (loading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">試合データ管理（閲覧専用）</h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            管理画面に戻る
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 font-medium">
                試合データは毎日AM12:00に自動更新されます
              </p>
              <p className="text-xs text-blue-600 mt-1">
                データソース: <a href="https://www.giravanz.jp/game/schedule.html" target="_blank" rel="noopener noreferrer" className="underline">ギラヴァンツ北九州公式サイト</a>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">📊 年度別閲覧数統計</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">年度を選択</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
          </div>

          {currentYearStat && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{currentYearStat.totalViews.toLocaleString()}</div>
                <div className="text-xs text-gray-600 mt-1">総閲覧数</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-800">{currentYearStat.totalMatches}</div>
                <div className="text-xs text-gray-600 mt-1">試合数</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{currentYearStat.wins}</div>
                <div className="text-xs text-gray-600 mt-1">勝利</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">{currentYearStat.draws}</div>
                <div className="text-xs text-gray-600 mt-1">引分</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{currentYearStat.losses}</div>
                <div className="text-xs text-gray-600 mt-1">敗北</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800">{selectedYear}年 試合一覧</h3>
            <p className="text-sm text-gray-600 mt-1">全{matches.length}試合</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">節</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">対戦カード</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">スコア</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">結果</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">会場</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">大会</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {selectedYear}年の試合データがありません
                    </td>
                  </tr>
                ) : (
                  matches.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{match.round}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(match.matchDate).toLocaleDateString('ja-JP', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {match.homeTeam} vs {match.awayTeam}
                        <span className="ml-2 text-xs text-gray-500">({match.location})</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        {match.homeScore !== null && match.awayScore !== null
                          ? `${match.homeScore} - ${match.awayScore}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {getResultBadge(match.result)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{match.stadium}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{match.competition}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
