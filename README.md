# Chess Coach AI - Treinador de Xadrez com Inteligência Artificial

Um sistema completo de treinamento de xadrez que utiliza o motor Stockfish para analisar partidas em tempo real e fornecer explicações detalhadas sobre cada movimento, ajudando jogadores a melhorarem seu rating.

## Funcionalidades Principais

### 1. Análise com IA em Tempo Real
- Motor Stockfish integrado via Web Worker
- Análise profunda de cada posição (profundidade 18)
- Avaliação numérica da posição (vantagem em centipawns)
- Detecção de xeque-mate

### 2. Feedback Educativo Detalhado
- Sugestão do melhor movimento
- Explicação clara do porquê aquele é o melhor lance
- Classificação de movimentos:
  - Brilhante
  - Excelente
  - Bom
  - Imprecisão
  - Erro
  - Erro Grave (Blunder)
- Análise de temas táticos:
  - Capturas
  - Xeques
  - Desenvolvimento de peças
  - Controle do centro
  - Coordenação de peças

### 3. Sistema de Pontuação e Precisão
- Cálculo automático de precisão da partida
- Avaliação baseada em erros e perdas de vantagem
- Histórico de movimentos com avaliações

### 4. Estatísticas e Progresso
- Dashboard com estatísticas completas:
  - Total de partidas
  - Taxa de vitória
  - Precisão média
  - Evolução do jogador
- Histórico de partidas salvas
- Análise de padrões de erros comuns

### 5. Banco de Dados com Supabase
- Armazenamento de partidas completas em formato PGN
- Registro de cada movimento com análise
- Sistema de estatísticas agregadas
- Row Level Security (RLS) para proteção de dados

## Tecnologias Utilizadas

### Frontend
- React 18.3 com TypeScript
- Vite como build tool
- React Router para navegação
- TailwindCSS para estilização
- shadcn/ui para componentes

### Xadrez
- chess.js para lógica do jogo
- react-chessboard para interface visual
- Stockfish.js como motor de análise

### Backend e Banco de Dados
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Políticas de acesso seguras

## Estrutura do Banco de Dados

### Tabela: users
- Perfil do usuário
- Rating estimado
- Controle de conta

### Tabela: games
- Partidas completas em formato PGN
- Resultado (vitória/derrota/empate)
- Rating do oponente
- Precisão da partida
- Abertura detectada

### Tabela: moves
- Registro de cada movimento
- Movimento do jogador vs melhor movimento
- Avaliação da posição
- Classificação do movimento
- Explicação detalhada
- FEN da posição

### Tabela: statistics
- Estatísticas agregadas por usuário
- Total de partidas
- Vitórias, derrotas, empates
- Precisão média
- Erros comuns identificados
- Áreas de melhoria

## Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd chess-coach-ai
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase
Crie um arquivo `.env` baseado em `.env.example`:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

### 4. Execute as migrações
As migrações já foram aplicadas automaticamente no Supabase. O banco inclui:
- 4 tabelas principais
- Políticas RLS para segurança
- Índices para performance

### 5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

### 6. Build para produção
```bash
npm run build
```

## Uso do Sistema

### Iniciando uma Partida
1. Acesse a página inicial
2. Clique em "Começar Treinamento"
3. Faça seus movimentos no tabuleiro interativo

### Analisando Movimentos
1. Após fazer um movimento, clique em "Analisar Posição"
2. A IA analisará e mostrará:
   - Melhor movimento
   - Avaliação numérica
   - Explicação detalhada
   - Classificação do movimento

### Salvando Partidas
1. Clique em "Salvar Partida" a qualquer momento
2. A partida será salva com:
   - PGN completo
   - Precisão calculada
   - Todos os movimentos analisados

### Visualizando Estatísticas
1. Acesse a aba "Estatísticas"
2. Veja suas métricas:
   - Total de jogos
   - Taxa de vitória
   - Precisão média
   - Evolução

### Histórico de Partidas
1. Acesse a aba "Histórico"
2. Veja todas suas partidas anteriores
3. Cada partida mostra:
   - Resultado
   - Rating do oponente
   - Abertura jogada
   - Precisão alcançada

## Componentes Principais

### ChessBoardComponent
- Tabuleiro interativo
- Drag and drop de peças
- Validação de movimentos legais
- Suporte a promoção de peões

### AICoachPanel
- Interface do treinador
- Exibição de sugestões
- Explicações detalhadas
- Badges de qualidade

### StatsDashboard
- Visualização de estatísticas
- Cards informativos
- Métricas em tempo real

### GameHistory
- Lista de partidas
- Detalhes de cada jogo
- Ordenação cronológica

## Sistema de Explicações

O sistema gera explicações considerando:

### Capturas
- Identifica peças capturadas
- Explica ganho de material

### Xeques e Xeque-mate
- Detecta xeques forçando respostas
- Identifica oportunidades de mate

### Desenvolvimento
- Analisa movimentos de desenvolvimento
- Explica importância do centro

### Temas Táticos
- Garfos
- Espetos
- Cravadas
- Controle de colunas/diagonais

## Segurança

### Row Level Security (RLS)
Todas as tabelas têm RLS ativado:
- Usuários só veem seus próprios dados
- Políticas restritivas por padrão
- Autenticação requerida para operações

### Políticas Implementadas
- SELECT: Apenas dados próprios
- INSERT: Apenas para contas próprias
- UPDATE: Apenas dados próprios
- DELETE: Cascata ao deletar usuário

## Performance

### Otimizações
- Web Worker para Stockfish (não bloqueia UI)
- Índices no banco de dados
- Componentes otimizados com React
- Lazy loading de rotas

## Próximas Melhorias

- Sistema de autenticação completo
- Integração com chess.com/lichess
- Treino de aberturas específicas
- Análise de finais
- Modo de treino tático
- Gráficos de evolução
- Comparação com outros jogadores
- Sistema de conquistas
- Exportação de análises
- Modo offline

## Créditos

- Motor Stockfish: https://stockfishchess.org/
- chess.js: https://github.com/jhlywa/chess.js
- react-chessboard: https://github.com/Clariity/react-chessboard
- shadcn/ui: https://ui.shadcn.com/
- Supabase: https://supabase.com/

---

Desenvolvido com foco em educação e melhoria contínua no xadrez.
