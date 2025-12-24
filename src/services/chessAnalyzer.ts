import { Chess } from 'chess.js';

export interface AnalysisResult {
  bestMove: string;
  evaluation: number;
  isBlunder: boolean;
  isMistake: boolean;
  isInaccuracy: boolean;
  explanation: string;
  moveQuality: 'brilliant' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
}

export class ChessAnalyzer {
  private static getMoveCategory(evalDrop: number): { isBlunder: boolean; isMistake: boolean; isInaccuracy: boolean; quality: string } {
    if (evalDrop >= 3) {
      return { isBlunder: true, isMistake: false, isInaccuracy: false, quality: 'blunder' };
    } else if (evalDrop >= 1.5) {
      return { isBlunder: false, isMistake: true, isInaccuracy: false, quality: 'mistake' };
    } else if (evalDrop >= 0.5) {
      return { isBlunder: false, isMistake: false, isInaccuracy: true, quality: 'inaccuracy' };
    } else if (evalDrop >= -0.3) {
      return { isBlunder: false, isMistake: false, isInaccuracy: false, quality: 'good' };
    } else if (evalDrop >= -0.8) {
      return { isBlunder: false, isMistake: false, isInaccuracy: false, quality: 'excellent' };
    } else {
      return { isBlunder: false, isMistake: false, isInaccuracy: false, quality: 'brilliant' };
    }
  }

  static generateExplanation(
    fen: string,
    playerMove: string,
    bestMove: string,
    evaluation: number,
    previousEval: number
  ): string {
    const game = new Chess(fen);
    const evalDrop = previousEval - evaluation;
    const category = this.getMoveCategory(evalDrop);

    let explanation = '';

    if (playerMove === bestMove) {
      explanation += '✓ Excelente! Você jogou o melhor movimento. ';

      if (category.quality === 'brilliant') {
        explanation += 'Este foi um lance brilhante que mudou drasticamente a avaliação do jogo a seu favor. ';
      } else if (category.quality === 'excellent') {
        explanation += 'Este lance melhorou significativamente sua posição. ';
      }

      explanation += this.getPositionalExplanation(game, playerMove);
    } else {
      const moveInfo = this.getMoveInfo(game, playerMove);
      const bestMoveInfo = this.getMoveInfo(game, bestMove);

      if (category.isBlunder) {
        explanation += `⚠️ ERRO GRAVE! Você jogou ${playerMove}, mas o melhor era ${bestMove}. `;
        explanation += `Este movimento piorou sua posição em aproximadamente ${Math.abs(evalDrop).toFixed(1)} pontos. `;
      } else if (category.isMistake) {
        explanation += `⚠ Erro: Você jogou ${playerMove}, mas ${bestMove} seria melhor. `;
        explanation += `Você perdeu cerca de ${Math.abs(evalDrop).toFixed(1)} pontos de vantagem. `;
      } else if (category.isInaccuracy) {
        explanation += `⚡ Imprecisão: ${bestMove} seria ligeiramente melhor que ${playerMove}. `;
      }

      explanation += '\n\n';
      explanation += `Por que ${bestMove} é melhor?\n`;
      explanation += this.compareMoves(moveInfo, bestMoveInfo, game);
    }

    explanation += '\n\n' + this.getTacticalThemes(game, bestMove);

    return explanation;
  }

  private static getMoveInfo(game: Chess, move: string): any {
    try {
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
      const promotion = move.length > 4 ? move[4] : undefined;

      const moveResult = game.move({ from, to, promotion });

      if (!moveResult) return null;

      const info = {
        piece: moveResult.piece,
        captured: moveResult.captured,
        from: moveResult.from,
        to: moveResult.to,
        san: moveResult.san,
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate()
      };

      game.undo();
      return info;
    } catch (e) {
      return null;
    }
  }

  private static compareMoves(playerMoveInfo: any, bestMoveInfo: any, game: Chess): string {
    if (!playerMoveInfo || !bestMoveInfo) return '';

    let explanation = '';

    if (bestMoveInfo.captured && !playerMoveInfo.captured) {
      explanation += `• ${bestMoveInfo.san} captura uma peça (${this.getPieceName(bestMoveInfo.captured)}), enquanto seu movimento não captura nada.\n`;
    }

    if (bestMoveInfo.isCheckmate) {
      explanation += `• ${bestMoveInfo.san} dá xeque-mate! Você perdeu a oportunidade de vencer imediatamente.\n`;
    } else if (bestMoveInfo.isCheck && !playerMoveInfo.isCheck) {
      explanation += `• ${bestMoveInfo.san} dá xeque ao rei adversário, forçando uma resposta.\n`;
    }

    const bestSquareControl = this.analyzeSquareControl(game, bestMoveInfo.to);
    const playerSquareControl = this.analyzeSquareControl(game, playerMoveInfo.to);

    if (bestSquareControl > playerSquareControl) {
      explanation += `• ${bestMoveInfo.san} controla casas mais importantes do tabuleiro.\n`;
    }

    return explanation || '• Este movimento melhora o desenvolvimento e a coordenação das peças.\n';
  }

  private static analyzeSquareControl(game: Chess, square: string): number {
    const centerSquares = ['e4', 'e5', 'd4', 'd5'];
    const extendedCenter = ['c3', 'c6', 'f3', 'f6', 'c4', 'c5', 'f4', 'f5'];

    let score = 0;
    if (centerSquares.includes(square)) score += 3;
    if (extendedCenter.includes(square)) score += 2;

    return score;
  }

  private static getPositionalExplanation(game: Chess, move: string): string {
    const moveInfo = this.getMoveInfo(game, move);
    if (!moveInfo) return '';

    let explanation = '';

    if (moveInfo.captured) {
      explanation += `Você capturou ${this.getPieceName(moveInfo.captured)}, ganhando material. `;
    }

    if (moveInfo.isCheckmate) {
      explanation += 'Xeque-mate! Você venceu a partida! ';
    } else if (moveInfo.isCheck) {
      explanation += 'Você deu xeque, forçando o adversário a mover o rei ou bloquear. ';
    }

    const isDevelopment = this.isDevelopmentMove(moveInfo);
    if (isDevelopment) {
      explanation += 'Este movimento desenvolve suas peças, melhorando sua posição. ';
    }

    return explanation;
  }

  private static isDevelopmentMove(moveInfo: any): boolean {
    if (!moveInfo) return false;
    const piece = moveInfo.piece;
    const from = moveInfo.from;

    const backRank = from[1] === '1' || from[1] === '8';
    const developingPieces = ['n', 'b', 'q'];

    return backRank && developingPieces.includes(piece);
  }

  private static getTacticalThemes(game: Chess, bestMove: string): string {
    let themes = '💡 Conceitos importantes nesta posição:\n';

    const moveInfo = this.getMoveInfo(game, bestMove);
    if (!moveInfo) return '';

    if (moveInfo.captured) {
      themes += '• Captura tática - ganho de material\n';
    }

    if (moveInfo.isCheck) {
      themes += '• Xeque - força o adversário a reagir\n';
    }

    const piece = moveInfo.piece;
    if (piece === 'n') {
      themes += '• Ativação do cavalo - controle de casas centrais\n';
    } else if (piece === 'b') {
      themes += '• Ativação do bispo - pressão nas diagonais\n';
    } else if (piece === 'r') {
      themes += '• Ativação da torre - domínio de colunas/linhas\n';
    } else if (piece === 'q') {
      themes += '• Ativação da dama - peça mais poderosa do jogo\n';
    }

    const centerControl = this.analyzeSquareControl(game, moveInfo.to);
    if (centerControl >= 2) {
      themes += '• Controle do centro - fundamental para dominar o jogo\n';
    }

    return themes;
  }

  private static getPieceName(piece: string): string {
    const names: { [key: string]: string } = {
      'p': 'peão',
      'n': 'cavalo',
      'b': 'bispo',
      'r': 'torre',
      'q': 'dama',
      'k': 'rei'
    };
    return names[piece] || 'peça';
  }
}
