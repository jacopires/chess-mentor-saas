"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AICoachPanelProps {
  currentFen: string;
  isLoading: boolean;
  suggestedMove: string | null;
  explanation: string | null;
  onAnalyze: () => void;
}

const AICoachPanel: React.FC<AICoachPanelProps> = ({
  currentFen,
  isLoading,
  suggestedMove,
  explanation,
  onAnalyze,
}) => {
  return (
    <Card className="w-full lg:w-96">
      <CardHeader>
        <CardTitle>Treinador de IA</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Aqui a IA irá analisar sua partida e sugerir os melhores movimentos, explicando o porquê.
        </p>
        <Button onClick={onAnalyze} disabled={isLoading} className="w-full mb-4">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            "Analisar Posição"
          )}
        </Button>

        {suggestedMove && (
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <h3 className="font-semibold text-lg">Melhor Movimento: <span className="text-primary">{suggestedMove}</span></h3>
            {explanation && (
              <p className="text-sm mt-2">{explanation}</p>
            )}
          </div>
        )}

        {!suggestedMove && !isLoading && (
          <p className="text-sm text-muted-foreground italic">
            Clique em "Analisar Posição" para obter a sugestão da IA.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AICoachPanel;