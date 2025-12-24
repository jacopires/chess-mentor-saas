"use client";

import React, { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import ChessBoardComponent from '@/components/ChessBoardComponent';
import AICoachPanel from '@/components/AICoachPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/toast';

const ChessGame: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [suggestedMove, setSuggestedMove] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleMove = useCallback((newFen: string) => {
    setGame(new Chess(newFen));
    setSuggestedMove(null); // Reset AI suggestion on new move
    setExplanation(null);
    showSuccess("Movimento realizado!");
  }, []);

  const handleAnalyze = async () => {
    setIsLoadingAI(true);
    setSuggestedMove(null);
    setExplanation(null);

    // --- Placeholder for AI Integration ---
    // In a real application, you would send the current FEN (game.fen())
    // to a backend service running a chess engine (like Stockfish)
    // and potentially an LLM for generating explanations.
    // For this example, we'll simulate a delay and provide a dummy suggestion.
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call delay

    // Dummy AI logic:
    const possibleMoves = game.moves({ verbose: true });
    if (possibleMoves.length > 0) {
      // For simplicity, let's just pick a random move as a "suggestion"
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      setSuggestedMove(`${randomMove.from}${randomMove.to}`);
      setExplanation(
        "Esta é uma explicação simulada. Em uma implementação real, a IA detalharia por que este é o melhor movimento, considerando táticas, estratégia e planos futuros."
      );
      showSuccess("Análise da IA concluída!");
    } else {
      setSuggestedMove("Nenhum movimento disponível.");
      setExplanation("A partida pode ter terminado ou não há movimentos legais.");
      showError("Não foi possível encontrar um movimento sugerido.");
    }
    // --- End Placeholder ---

    setIsLoadingAI(false);
  };

  const resetGame = () => {
    setGame(new Chess());
    setSuggestedMove(null);
    setExplanation(null);
    showSuccess("Partida reiniciada!");
  };

  const flipBoard = () => {
    setBoardOrientation(prev => (prev === 'white' ? 'black' : 'white'));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col items-center">
          <div className="flex justify-between w-full max-w-lg mb-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Xadrez com IA</h1>
            <Button onClick={resetGame} variant="destructive">
              Reiniciar Jogo
            </Button>
          </div>
          <ChessBoardComponent
            game={game}
            onMove={handleMove}
            boardOrientation={boardOrientation}
          />
          <div className="flex gap-4 mt-4">
            <Button onClick={flipBoard} variant="secondary">
              Inverter Tabuleiro
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center lg:justify-start">
          <AICoachPanel
            currentFen={game.fen()}
            isLoading={isLoadingAI}
            suggestedMove={suggestedMove}
            explanation={explanation}
            onAnalyze={handleAnalyze}
          />
        </div>
      </div>
    </div>
  );
};

export default ChessGame;