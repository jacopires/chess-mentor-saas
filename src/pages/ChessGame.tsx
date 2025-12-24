"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import ChessBoardComponent from '@/components/ChessBoardComponent';
import AICoachPanel from '@/components/AICoachPanel';
import StatsDashboard from '@/components/StatsDashboard';
import GameHistory from '@/components/GameHistory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';
import { ChessAnalyzer } from '@/services/chessAnalyzer';
import { GameService } from '@/services/gameService';

const ChessGame: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [suggestedMove, setSuggestedMove] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [previousEvaluation, setPreviousEvaluation] = useState<number>(0);
  const [moveQuality, setMoveQuality] = useState<'brilliant' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | null>(null);
  const [moveHistory, setMoveHistory] = useState<Array<{ fen: string; move: string; evaluation: number }>>([]);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  const stockfishWorkerRef = useRef<Worker | null>(null);
  const userId = 'demo-user';

  useEffect(() => {
    try {
      stockfishWorkerRef.current = new Worker('/src/lib/stockfish/stockfish.js');

      stockfishWorkerRef.current.onmessage = (event: MessageEvent) => {
        const data = event.data;

        if (typeof data === 'string') {
          if (data.startsWith('bestmove')) {
            const parts = data.split(' ');
            if (parts.length >= 2) {
              const move = parts[1];
              setSuggestedMove(move);

              const explanationText = ChessAnalyzer.generateExplanation(
                game.fen(),
                moveHistory.length > 0 ? moveHistory[moveHistory.length - 1].move : move,
                move,
                evaluation || 0,
                previousEvaluation
              );
              setExplanation(explanationText);

              showSuccess("Análise concluída!");
              setIsLoadingAI(false);
            }
          } else if (data.includes('info depth') && data.includes('score cp')) {
            const match = data.match(/score cp (-?\d+)/);
            if (match) {
              const centipawns = parseInt(match[1]);
              const evalScore = centipawns / 100;
              setEvaluation(evalScore);
            }
          } else if (data.includes('score mate')) {
            const match = data.match(/score mate (-?\d+)/);
            if (match) {
              const mateIn = parseInt(match[1]);
              setEvaluation(mateIn > 0 ? 999 : -999);
            }
          }
        }
      };

      stockfishWorkerRef.current.onerror = (error) => {
        console.error("Stockfish Worker error:", error);
        showError("Erro ao inicializar o motor de análise.");
        setIsLoadingAI(false);
      };

      stockfishWorkerRef.current.postMessage('uci');
    } catch (error) {
      console.error("Error creating Stockfish worker:", error);
      showError("Erro ao carregar o motor de xadrez.");
    }

    return () => {
      stockfishWorkerRef.current?.terminate();
    };
  }, []);

  const handleMove = useCallback((newFen: string) => {
    const newGame = new Chess(newFen);
    const lastMove = newGame.history({ verbose: true }).pop();

    if (lastMove) {
      const moveNotation = lastMove.from + lastMove.to + (lastMove.promotion || '');
      setMoveHistory(prev => [...prev, {
        fen: game.fen(),
        move: moveNotation,
        evaluation: evaluation || 0
      }]);
      setPreviousEvaluation(evaluation || 0);
    }

    setGame(newGame);
    setSuggestedMove(null);
    setExplanation(null);
    setEvaluation(null);
    setMoveQuality(null);
  }, [game, evaluation]);

  const handleAnalyze = async () => {
    if (!stockfishWorkerRef.current) {
      showError("Motor de análise não está disponível.");
      return;
    }

    setIsLoadingAI(true);
    setSuggestedMove(null);
    setExplanation(null);
    setMoveQuality(null);

    stockfishWorkerRef.current.postMessage('ucinewgame');
    stockfishWorkerRef.current.postMessage(`position fen ${game.fen()}`);
    stockfishWorkerRef.current.postMessage('go depth 18');
  };

  const saveGame = async () => {
    const pgn = game.pgn();
    const result = game.isCheckmate()
      ? (game.turn() === 'w' ? 'loss' : 'win')
      : game.isDraw()
      ? 'draw'
      : 'win';

    const accuracy = calculateAccuracy();

    const gameId = await GameService.saveGame(userId, pgn, result, accuracy);

    if (gameId) {
      setCurrentGameId(gameId);
      await GameService.updateStatistics(userId, result, accuracy);
      showSuccess("Partida salva com sucesso!");
    } else {
      showError("Erro ao salvar a partida.");
    }
  };

  const calculateAccuracy = (): number => {
    if (moveHistory.length === 0) return 100;

    let totalError = 0;
    moveHistory.forEach((move, index) => {
      if (index > 0) {
        const evalDrop = Math.abs(move.evaluation - moveHistory[index - 1].evaluation);
        totalError += Math.min(evalDrop, 3);
      }
    });

    const avgError = totalError / moveHistory.length;
    const accuracy = Math.max(0, 100 - (avgError * 10));
    return Math.round(accuracy);
  };

  const resetGame = () => {
    setGame(new Chess());
    setSuggestedMove(null);
    setExplanation(null);
    setEvaluation(null);
    setPreviousEvaluation(0);
    setMoveQuality(null);
    setMoveHistory([]);
    setCurrentGameId(null);
    showSuccess("Nova partida iniciada!");
  };

  const flipBoard = () => {
    setBoardOrientation(prev => (prev === 'white' ? 'black' : 'white'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Início
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            🎯 Treinamento de Xadrez com IA
          </h1>
          <div className="flex gap-2">
            <Button onClick={saveGame} variant="default" className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Salvar Partida
            </Button>
            <Button onClick={resetGame} variant="destructive">
              Nova Partida
            </Button>
          </div>
        </div>

        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="game">Jogo</TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart className="h-4 w-4 mr-2" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="game">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 flex flex-col items-center">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
                  <ChessBoardComponent
                    game={game}
                    onMove={handleMove}
                    boardOrientation={boardOrientation}
                  />
                  <div className="flex gap-4 mt-4 justify-center">
                    <Button onClick={flipBoard} variant="secondary" size="lg">
                      🔄 Inverter Tabuleiro
                    </Button>
                  </div>

                  {moveHistory.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="font-semibold mb-2 text-sm text-gray-600 dark:text-gray-300">
                        MOVIMENTOS DA PARTIDA
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {game.pgn() || 'Nenhum movimento ainda'}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        Total de movimentos: {moveHistory.length} | Precisão estimada: {calculateAccuracy()}%
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <AICoachPanel
                  currentFen={game.fen()}
                  isLoading={isLoadingAI}
                  suggestedMove={suggestedMove}
                  explanation={explanation}
                  evaluation={evaluation}
                  moveQuality={moveQuality}
                  onAnalyze={handleAnalyze}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <StatsDashboard userId={userId} />
          </TabsContent>

          <TabsContent value="history">
            <GameHistory userId={userId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChessGame;
