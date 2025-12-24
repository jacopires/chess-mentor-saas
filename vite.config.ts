import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Removendo aliases explícitos para 'react' e 'react-dom'
      // "react": path.resolve(__dirname, "node_modules/react"),
      // "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
  optimizeDeps: {
    exclude: ['react', 'react-dom', 'react-chessboard'], // Excluir react, react-dom e react-chessboard da otimização de dependências
  },
}));