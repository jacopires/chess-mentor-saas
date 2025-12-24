"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Target, TrendingDown, Calendar } from 'lucide-react';
import { Game } from '@/lib/supabase';
import { GameService } from '@/services/gameService';

interface GameHistoryProps {
  userId: string;
}

const GameHistory: React.FC<GameHistoryProps> = ({ userId }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGames();
  }, [userId]);

  const loadGames = async () => {
    setLoading(true);
    const history = await GameService.getGameHistory(userId);
    setGames(history);
    setLoading(false);
  };

  const getResultBadge = (result: string) => {
    const badges = {
      win: { color: 'bg-green-500', text: 'Vitória' },
      loss: { color: 'bg-red-500', text: 'Derrota' },
      draw: { color: 'bg-yellow-500', text: 'Empate' },
    };
    const badge = badges[result as keyof typeof badges];
    return <Badge className={`${badge.color} text-white`}>{badge.text}</Badge>;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 75) return 'text-blue-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Partidas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Histórico de Partidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {games.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhuma partida registrada ainda.</p>
              <p className="text-sm mt-1">Comece a jogar para ver seu histórico!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getResultBadge(game.result)}
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        vs {game.opponent_rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(game.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Abertura:</span>
                      <span className="ml-2 font-medium">{game.opening_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-gray-500" />
                      <span className={`font-bold ${getAccuracyColor(game.accuracy)}`}>
                        {game.accuracy.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GameHistory;
