// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
importScripts('/src/lib/stockfish/stockfish.js');

let stockfish = new Worker('/src/lib/stockfish/stockfish.js');

stockfish.onmessage = function (event: MessageEvent) {
  // Encaminha a mensagem do Stockfish para a thread principal
  postMessage(event.data);
};

onmessage = function (event: MessageEvent) {
  // Envia comandos da thread principal para o Stockfish
  stockfish.postMessage(event.data);
};