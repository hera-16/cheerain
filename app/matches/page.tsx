'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [stats, setStats] = useState({ wins: 0, draws: 0, losses: 0, total: 0 });
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    fetchMatches();
  }, [selectedCompetition, selectedYear]);

  const fetchMatches = async () => {
    try {
      let url = 'http://localhost:8080/api/v1/matches';
      const params = new URLSearchParams();
      
      if (selectedCompetition !== 'all') {
        params.append('competition', selectedCompetition);
      }
      if (selectedYear !== 'all') {
        params.append('year', selectedYear);
      }
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setMatches(data.data);
        calculateStats(data.data);
        extractAvailableYears(data.data);
      }
    } catch (error) {
      console.error('試合データの取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractAvailableYears = (matchList: Match[]) => {
    const years = [...new Set(matchList.map(m => new Date(m.matchDate).getFullYear().toString()))];
    setAvailableYears(years.sort((a, b) => parseInt(b) - parseInt(a)));
  };

  const calculateStats = (matchList: Match[]) => {
    const completedMatches = matchList.filter(m => m.result !== 'SCHEDULED');
    const wins = completedMatches.filter(m => m.result === 'WIN').length;
    const draws = completedMatches.filter(m => m.result === 'DRAW').length;
    const losses = completedMatches.filter(m => m.result === 'LOSE').length;
    
    setStats({
      wins,
      draws,
      losses,
      total: completedMatches.length,
    });
  };

  const getResultBadge = (result: string) => {
    const badges = {
      WIN: 'bg-green-500 text-white',
      LOSE: 'bg-red-500 text-white',
      DRAW: 'bg-yellow-500 text-white',
      SCHEDULED: 'bg-gray-400 text-white',
    };
    const labels = {
      WIN: '勝利',
      LOSE: '敗北',
      DRAW: '引分',
      SCHEDULED: '未実施',
    };
    return (
      <div className={`px-4 py-2 rounded-full text-sm font-bold ${badges[result as keyof typeof badges]}`}>
        {labels[result as keyof typeof labels]}
      </div>
    );
  };

  const formatScore = (match: Match) => {
    if (match.homeScore === null || match.awayScore === null) {
      return 'VS';
    }
    
    const isHome = match.location === 'HOME';
    const kitakyushuScore = isHome ? match.homeScore : match.awayScore;
    const opponentScore = isHome ? match.awayScore : match.homeScore;
    
    return (
      <span className="text-2xl font-bold">
        <span className={match.result === 'WIN' ? 'text-green-600' : match.result === 'LOSE' ? 'text-red-600' : ''}>
          {kitakyushuScore}
        </span>
        {' - '}
        <span className={match.result === 'WIN' ? 'text-red-400' : match.result === 'LOSE' ? 'text-green-400' : ''}>
          {opponentScore}
        </span>
      </span>
    );
  };

  const getOpponent = (match: Match) => {
    return match.location === 'HOME' ? match.awayTeam : match.homeTeam;
  };

  const recordMatchView = async (matchId: string) => {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      await fetch(`http://localhost:8080/api/v1/matches/${matchId}/view`, {
        method: 'POST',
        headers,
      });
    } catch (error) {
      console.error('閲覧記録の送信に失敗:', error);
    }
  };

  const handleMatchClick = (match: Match) => {
    recordMatchView(match.id);
    if (match.matchInfoUrl) {
      window.open(match.matchInfoUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="text-xl text-gray-900 font-semibold">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-8 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-4 mb-4 text-sm">
            <Link href="/mypage" className="hover:underline">
              ← マイページに戻る
            </Link>
            {typeof window !== 'undefined' && localStorage.getItem('token') && (
              <>
                <span className="text-red-300">|</span>
                <Link href="/" className="hover:underline">
                  ホーム
                </Link>
              </>
            )}
          </div>
          <h1 className="text-4xl font-black tracking-wider">⚽ 試合結果・戦績</h1>
          <p className="mt-2 text-red-100">ギラヴァンツ北九州 {selectedYear === 'all' ? '全シーズン' : `${selectedYear}シーズン`}</p>
          <a 
            href="https://www.giravanz.jp/game/schedule.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-yellow-300 hover:text-yellow-100 underline"
          >
            📅 公式スケジュールを見る
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 年別フィルター */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">シーズン</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedYear('all')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
                selectedYear === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            >
              全シーズン
            </button>
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
                  selectedYear === year
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-300'
                }`}
              >
                {year}年
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 統計サマリー */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">📊 通算成績</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-800 font-medium">試合数</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-3xl font-bold text-green-600">{stats.wins}</div>
              <div className="text-sm text-gray-800 font-medium">勝利</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded">
              <div className="text-3xl font-bold text-yellow-600">{stats.draws}</div>
              <div className="text-sm text-gray-800 font-medium">引分</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded">
              <div className="text-3xl font-bold text-red-600">{stats.losses}</div>
              <div className="text-sm text-gray-800 font-medium">敗北</div>
            </div>
          </div>
          {stats.total > 0 && (
            <div className="mt-4 text-center text-sm text-gray-900 font-semibold">
              勝率: {((stats.wins / stats.total) * 100).toFixed(1)}%
            </div>
          )}
        </div>

        {/* 大会別フィルター */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">大会</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCompetition('all')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
                selectedCompetition === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            >
              すべて
            </button>
            <button
              onClick={() => setSelectedCompetition('J3リーグ')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
                selectedCompetition === 'J3リーグ'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            >
              J3リーグ
            </button>
            <button
              onClick={() => setSelectedCompetition('天皇杯')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
                selectedCompetition === '天皇杯'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            >
              天皇杯
            </button>
            <button
              onClick={() => setSelectedCompetition('ルヴァンカップ')}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${
                selectedCompetition === 'ルヴァンカップ'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300'
              }`}
            >
              ルヴァンカップ
            </button>
          </div>
        </div>

        {/* 試合一覧 */}
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-800">
              試合データがありません
            </div>
          ) : (
            matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition p-6 cursor-pointer"
                onClick={() => handleMatchClick(match)}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* 左側: 日時・節・大会 */}
                  <div className="flex-shrink-0">
                    <div className="text-sm text-gray-900 font-medium mb-1">
                      {new Date(match.matchDate).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                      })}
                      {' '}
                      {new Date(match.matchDate).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                        第{match.round}節
                      </span>
                      <span className="text-xs text-gray-800 font-medium">{match.competition}</span>
                    </div>
                  </div>

                  {/* 中央: スコア */}
                  <div className="flex-1 flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold mb-1 text-gray-900">北九州</div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                        {match.location}
                      </span>
                    </div>

                    <div className="text-center px-4">
                      {formatScore(match)}
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-bold mb-1 text-gray-900">{getOpponent(match)}</div>
                      <span className="text-xs text-gray-700 font-medium">{match.stadium}</span>
                    </div>
                  </div>

                  {/* 右側: 結果 */}
                  <div className="flex-shrink-0 text-center">
                    {getResultBadge(match.result)}
                    {match.matchInfoUrl && (
                      <div className="mt-2 text-sm text-blue-600 font-semibold">
                        詳細 →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
