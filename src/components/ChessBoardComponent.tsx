"use client";

import React from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface ChessBoardComponentProps {
  game: Chess;
  onMove: (move: string) => void;
  boardOrientation: 'white' | 'black';
}

const ChessBoardComponent: React.FC<ChessBoardComponentProps> = ({ game, onMove, boardOrientation }) => {
  function onDrop(sourceSquare: string, targetSquare: string, piece: string) {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1].toLowerCase() === 'p' && ['8', '1'].includes(targetSquare[1]) ? 'q' : undefined, // Promote to queen by default
      });

      if (move === null) return false; // Illegal move

      onMove(game.fen());
      return true;
    } catch (e) {
      console.error("Movimento inválido:", e);
      return false;
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={boardOrientation}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      />
    </div>
  );
};

export default ChessBoardComponent;