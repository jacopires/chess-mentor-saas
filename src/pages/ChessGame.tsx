"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
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

  const stockfishWorkerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Inicializa o Web Worker do Stockfish
    stockfishWorkerRef.current = new Worker(new URL('../workers/stockfishWorker.ts', import.meta.url));

    stockfishWorkerRef.current.onmessage = (event: MessageEvent) => {
      const data = event.data;
      console.log('Stockfish output:', data);

      // Exemplo de como parsear a saída do Stockfish para o melhor movimento
      if (typeof data === 'string' && data.startsWith('bestmove')) {
        const parts = data.split(' ');
        if (parts.length >= 2) {
          const move = parts[1];
          setSuggestedMove(move);
          setExplanation(
            "A IA sugeriu este movimento. Em uma implementação completa, a explicação seria mais detalhada, baseada na análise do motor."
          );
          showSuccess("Análise da IA concluída!");
        }
      } else if (typeof data === 'string' && data.includes('info depth')) {
        // Você pode usar isso para mostrar o progresso da análise
        // console.log('Stockfish analysis progress:', data);
      }
      setIsLoadingAI(false);
    };

    stockfishWorkerRef.current.onerror = (error) => {
      console.error("Stockfish Worker error:", error);
      showError("Erro na análise da IA.");
      setIsLoadingAI(false);
    };

    // Limpa o worker quando o componente é desmontado
    return () => {
      stockfishWorkerRef.current?.terminate();
    };
  }, []);

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

    if (stockfishWorkerRef.current) {
      stockfishWorkerRef.current.postMessage('ucinewgame');
      stockfishWorkerRef.current.postMessage(`position fen ${game.fen()}`);
      stockfishWorkerRef.current.postMessage('go depth 15'); // Analisar até a profundidade 15
    } else {
      showError("Stockfish worker não está pronto.");
      setIsLoadingAI(false);
    }
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