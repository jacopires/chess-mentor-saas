/*
  # Sistema de Treinamento de Xadrez com IA

  ## Novas Tabelas
  
  1. `users`
     - `id` (uuid, primary key)
     - `username` (text, unique)
     - `email` (text, unique)
     - `rating` (integer) - Rating ELO estimado do jogador
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

  2. `games`
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `pgn` (text) - Partida em formato PGN
     - `result` (text) - Resultado: win, loss, draw
     - `opponent_rating` (integer)
     - `time_control` (text)
     - `opening_name` (text)
     - `accuracy` (float) - Precisão do jogador na partida
     - `created_at` (timestamptz)

  3. `moves`
     - `id` (uuid, primary key)
     - `game_id` (uuid, foreign key)
     - `move_number` (integer)
     - `player_move` (text) - Movimento feito pelo jogador
     - `best_move` (text) - Melhor movimento sugerido pela IA
     - `evaluation` (float) - Avaliação da posição
     - `is_blunder` (boolean)
     - `is_mistake` (boolean)
     - `is_inaccuracy` (boolean)
     - `explanation` (text) - Explicação detalhada
     - `position_fen` (text) - Posição antes do movimento
     - `created_at` (timestamptz)

  4. `statistics`
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key)
     - `total_games` (integer)
     - `wins` (integer)
     - `losses` (integer)
     - `draws` (integer)
     - `average_accuracy` (float)
     - `common_mistakes` (jsonb) - Padrões de erros comuns
     - `improvement_areas` (jsonb) - Áreas para melhorar
     - `updated_at` (timestamptz)

  ## Segurança
  - RLS habilitado em todas as tabelas
  - Usuários podem ver apenas seus próprios dados
*/

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  rating integer DEFAULT 1200,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Tabela de partidas
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  pgn text NOT NULL,
  result text CHECK (result IN ('win', 'loss', 'draw')),
  opponent_rating integer DEFAULT 1200,
  time_control text DEFAULT 'unlimited',
  opening_name text DEFAULT '',
  accuracy float DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own games"
  ON games FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own games"
  ON games FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Tabela de movimentos
CREATE TABLE IF NOT EXISTS moves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  move_number integer NOT NULL,
  player_move text NOT NULL,
  best_move text DEFAULT '',
  evaluation float DEFAULT 0,
  is_blunder boolean DEFAULT false,
  is_mistake boolean DEFAULT false,
  is_inaccuracy boolean DEFAULT false,
  explanation text DEFAULT '',
  position_fen text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE moves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view moves from own games"
  ON moves FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = moves.game_id
      AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert moves to own games"
  ON moves FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = moves.game_id
      AND games.user_id = auth.uid()
    )
  );

-- Tabela de estatísticas
CREATE TABLE IF NOT EXISTS statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  total_games integer DEFAULT 0,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  draws integer DEFAULT 0,
  average_accuracy float DEFAULT 0,
  common_mistakes jsonb DEFAULT '[]'::jsonb,
  improvement_areas jsonb DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own statistics"
  ON statistics FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own statistics"
  ON statistics FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own statistics"
  ON statistics FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Índices para performance
CREATE INDEX IF NOT EXISTS games_user_id_idx ON games(user_id);
CREATE INDEX IF NOT EXISTS games_created_at_idx ON games(created_at DESC);
CREATE INDEX IF NOT EXISTS moves_game_id_idx ON moves(game_id);
CREATE INDEX IF NOT EXISTS moves_move_number_idx ON moves(move_number);
CREATE INDEX IF NOT EXISTS statistics_user_id_idx ON statistics(user_id);
