import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Target, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chess Coach AI
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-2">
            Treinador de Xadrez com Inteligência Artificial
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Aprenda xadrez jogando e recebendo feedback em tempo real da IA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-12 w-12 mx-auto mb-2 text-blue-600" />
              <CardTitle className="text-lg">Análise com IA</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Motor Stockfish analisa cada jogada em tempo real
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Target className="h-12 w-12 mx-auto mb-2 text-green-600" />
              <CardTitle className="text-lg">Feedback Detalhado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explicações claras sobre cada movimento
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mx-auto mb-2 text-purple-600" />
              <CardTitle className="text-lg">Acompanhe Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Estatísticas e evolução do seu jogo
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-12 w-12 mx-auto mb-2 text-yellow-600" />
              <CardTitle className="text-lg">Melhore seu Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Corrija erros e aprenda com a IA
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Pronto para melhorar seu jogo?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Comece agora e receba análises detalhadas de cada movimento. A IA não apenas sugere o melhor lance,
            mas explica o porquê, ajudando você a desenvolver seu pensamento estratégico.
          </p>
          <Link to="/chess">
            <Button size="lg" className="text-xl px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl">
              <Brain className="mr-3 h-6 w-6" />
              Começar Treinamento
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <h3 className="font-bold text-3xl text-blue-600 mb-2">1000+</h3>
            <p className="text-gray-600 dark:text-gray-400">Partidas Analisadas</p>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-3xl text-green-600 mb-2">95%</h3>
            <p className="text-gray-600 dark:text-gray-400">Precisão do Motor</p>
          </div>
          <div className="p-6">
            <h3 className="font-bold text-3xl text-purple-600 mb-2">24/7</h3>
            <p className="text-gray-600 dark:text-gray-400">Disponível Sempre</p>
          </div>
        </div>

        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;