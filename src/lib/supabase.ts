import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  username: string;
  email: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  user_id: string;
  pgn: string;
  result: 'win' | 'loss' | 'draw';
  opponent_rating: number;
  time_control: string;
  opening_name: string;
  accuracy: number;
  created_at: string;
}

export interface Move {
  id: string;
  game_id: string;
  move_number: number;
  player_move: string;
  best_move: string;
  evaluation: number;
  is_blunder: boolean;
  is_mistake: boolean;
  is_inaccuracy: boolean;
  explanation: string;
  position_fen: string;
  created_at: string;
}

export interface Statistics {
  id: string;
  user_id: string;
  total_games: number;
  wins: number;
  losses: number;
  draws: number;
  average_accuracy: number;
  common_mistakes: any[];
  improvement_areas: any[];
  updated_at: string;
}
