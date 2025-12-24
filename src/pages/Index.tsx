import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">Bem-vindo ao Seu Aplicativo</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Comece a construir seu incrível projeto aqui!
        </p>
        <Link to="/chess">
          <Button size="lg" className="text-lg px-8 py-4">
            Iniciar Jogo de Xadrez com IA
          </Button>
        </Link>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;