"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AICoachPanelProps {
  currentFen: string;
  isLoading: boolean;
  suggestedMove: string | null;
  explanation: string | null;
  evaluation: number | null;
  moveQuality: 'brilliant' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder' | null;
  onAnalyze: () => void;
}

const AICoachPanel: React.FC<AICoachPanelProps> = ({
  currentFen,
  isLoading,
  suggestedMove,
  explanation,
  evaluation,
  moveQuality,
  onAnalyze,
}) => {
  const getMoveQualityBadge = () => {
    if (!moveQuality) return null;

    const badges = {
      brilliant: { color: 'bg-purple-500', icon: '✨', text: 'Brilhante!' },
      excellent: { color: 'bg-green-500', icon: '👏', text: 'Excelente' },
      good: { color: 'bg-blue-500', icon: '✓', text: 'Bom' },
      inaccuracy: { color: 'bg-yellow-500', icon: '⚡', text: 'Imprecisão' },
      mistake: { color: 'bg-orange-500', icon: '⚠', text: 'Erro' },
      blunder: { color: 'bg-red-500', icon: '⚠️', text: 'Erro Grave' },
    };

    const badge = badges[moveQuality];
    return (
      <Badge className={`${badge.color} text-white mb-3`}>
        <span className="mr-1">{badge.icon}</span>
        {badge.text}
      </Badge>
    );
  };

  const formatEvaluation = (evalScore: number) => {
    if (evalScore > 0) {
      return `+${evalScore.toFixed(1)} (Vantagem Brancas)`;
    } else if (evalScore < 0) {
      return `${evalScore.toFixed(1)} (Vantagem Pretas)`;
    }
    return '0.0 (Posição Igual)';
  };

  return (
    <Card className="w-full lg:w-96 h-fit shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Treinador de IA
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Analise cada jogada e aprenda com explicações detalhadas da IA!
          </p>
        </div>

        <Button
          onClick={onAnalyze}
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analisando com IA...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-5 w-5" />
              Analisar Posição
            </>
          )}
        </Button>

        {evaluation !== null && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                AVALIAÇÃO DA POSIÇÃO
              </span>
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {formatEvaluation(evaluation)}
            </p>
          </div>
        )}

        {suggestedMove && (
          <div className="space-y-3">
            {getMoveQualityBadge()}

            <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border-2 border-green-300 dark:border-green-700">
              <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
                MELHOR MOVIMENTO
              </h3>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {suggestedMove}
              </p>
            </div>

            {explanation && (
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-purple-600" />
                  <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400">
                    EXPLICAÇÃO DETALHADA
                  </h3>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {explanation}
                </div>
              </div>
            )}
          </div>
        )}

        {!suggestedMove && !isLoading && (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Faça um movimento e clique em "Analisar Posição" para receber feedback da IA
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICoachPanel;