import { supabase, Game, Move, Statistics } from '@/lib/supabase';
import { Chess } from 'chess.js';

export class GameService {
  static async saveGame(
    userId: string,
    pgn: string,
    result: 'win' | 'loss' | 'draw',
    accuracy: number,
    opponentRating: number = 1200
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('games')
        .insert({
          user_id: userId,
          pgn,
          result,
          accuracy,
          opponent_rating: opponentRating,
          time_control: 'unlimited',
          opening_name: this.detectOpening(pgn)
        })
        .select('id')
        .maybeSingle();

      if (error) throw error;
      return data?.id || null;
    } catch (error) {
      console.error('Error saving game:', error);
      return null;
    }
  }

  static async saveMove(
    gameId: string,
    moveNumber: number,
    playerMove: string,
    bestMove: string,
    evaluation: number,
    isBlunder: boolean,
    isMistake: boolean,
    isInaccuracy: boolean,
    explanation: string,
    positionFen: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('moves')
        .insert({
          game_id: gameId,
          move_number: moveNumber,
          player_move: playerMove,
          best_move: bestMove,
          evaluation,
          is_blunder: isBlunder,
          is_mistake: isMistake,
          is_inaccuracy: isInaccuracy,
          explanation,
          position_fen: positionFen
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving move:', error);
      return false;
    }
  }

  static async getGameHistory(userId: string, limit: number = 10): Promise<Game[]> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching game history:', error);
      return [];
    }
  }

  static async getGameMoves(gameId: string): Promise<Move[]> {
    try {
      const { data, error } = await supabase
        .from('moves')
        .select('*')
        .eq('game_id', gameId)
        .order('move_number', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching game moves:', error);
      return [];
    }
  }

  static async updateStatistics(
    userId: string,
    result: 'win' | 'loss' | 'draw',
    accuracy: number
  ): Promise<void> {
    try {
      const { data: existing } = await supabase
        .from('statistics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        const totalGames = existing.total_games + 1;
        const wins = result === 'win' ? existing.wins + 1 : existing.wins;
        const losses = result === 'loss' ? existing.losses + 1 : existing.losses;
        const draws = result === 'draw' ? existing.draws + 1 : existing.draws;
        const avgAccuracy = (existing.average_accuracy * existing.total_games + accuracy) / totalGames;

        await supabase
          .from('statistics')
          .update({
            total_games: totalGames,
            wins,
            losses,
            draws,
            average_accuracy: avgAccuracy,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('statistics')
          .insert({
            user_id: userId,
            total_games: 1,
            wins: result === 'win' ? 1 : 0,
            losses: result === 'loss' ? 1 : 0,
            draws: result === 'draw' ? 1 : 0,
            average_accuracy: accuracy
          });
      }
    } catch (error) {
      console.error('Error updating statistics:', error);
    }
  }

  static async getStatistics(userId: string): Promise<Statistics | null> {
    try {
      const { data, error } = await supabase
        .from('statistics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return null;
    }
  }

  private static detectOpening(pgn: string): string {
    const chess = new Chess();
    const moves = pgn.split(/\d+\./).filter(m => m.trim());

    if (moves.length === 0) return 'Unknown';

    try {
      const firstMoves = moves.slice(0, Math.min(3, moves.length));
      firstMoves.forEach(move => {
        const [white, black] = move.trim().split(/\s+/);
        if (white) chess.move(white);
        if (black) chess.move(black);
      });

      const openings: { [key: string]: string } = {
        'e2e4 e7e5': 'Abertura Italiana / Espanhola',
        'e2e4 c7c5': 'Defesa Siciliana',
        'd2d4 d7d5': 'Abertura de Dama',
        'd2d4 g8f6': 'Defesa Índia',
        'e2e4 e7e6': 'Defesa Francesa',
        'e2e4 c7c6': 'Defesa Caro-Kann',
        'c2c4': 'Abertura Inglesa',
        'g1f3': 'Abertura Réti'
      };

      const history = chess.history({ verbose: true });
      if (history.length >= 2) {
        const key = `${history[0].from}${history[0].to} ${history[1].from}${history[1].to}`;
        return openings[key] || 'Abertura Padrão';
      }
    } catch (e) {
      console.error('Error detecting opening:', e);
    }

    return 'Abertura Padrão';
  }
}
