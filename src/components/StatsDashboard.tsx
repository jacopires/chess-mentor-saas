"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, TrendingUp, Activity } from 'lucide-react';
import { Statistics } from '@/lib/supabase';
import { GameService } from '@/services/gameService';

interface StatsDashboardProps {
  userId: string;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ userId }) => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    setLoading(true);
    const statistics = await GameService.getStatistics(userId);
    setStats(statistics);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Comece a jogar para ver suas estatísticas!
          </p>
        </CardContent>
      </Card>
    );
  }

  const winRate = stats.total_games > 0
    ? ((stats.wins / stats.total_games) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total de Partidas
          </CardTitle>
          <Activity className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total_games}</div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.wins}V - {stats.losses}D - {stats.draws}E
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Taxa de Vitória
          </CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{winRate}%</div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.wins} vitórias de {stats.total_games} jogos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Precisão Média
          </CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">
            {stats.average_accuracy.toFixed(1)}%
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Qualidade dos movimentos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Evolução
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">
            {stats.average_accuracy >= 75 ? '📈' : stats.average_accuracy >= 60 ? '➡️' : '📉'}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.average_accuracy >= 75
              ? 'Excelente progresso!'
              : stats.average_accuracy >= 60
              ? 'Continua melhorando'
              : 'Treine mais!'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDashboard;
