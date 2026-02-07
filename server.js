const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// Estrutura das salas
// salas[codigo] = {
//   admin: socketId,
//   jogadores: [{ id, nome }]
// }
let salas = {};

// Palavras do jogo
const palavras = [
  "Banana",
  "Carro",
  "Escola",
  "Pizza",
  "Hospital",
  "Cinema",
  "Praia",
  "Aeroporto",
  "Celular",
  "Computador",
  "Cachorro",
  "Gato",
  "Brasil",
  "Futebol",
  "Hambúrguer",
  "Dinheiro"
];

// Gera código da sala
function gerarCodigo() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

io.on("connection", (socket) => {

  console.log("Conectado:", socket.id);

  // ADMIN cria a sala
  socket.on("criarSala", ({ nome }) => {
    const codigo = gerarCodigo();

    salas[codigo] = {
      admin: socket.id,
      jogadores: [{ id: socket.id, nome }]
    };

    socket.join(codigo);

    socket.emit("salaCriada", codigo);
    io.to(codigo).emit("lista", salas[codigo].jogadores);
  });

  // GUEST entra na sala
  socket.on("entrarSala", ({ codigo, nome }) => {
    const sala = salas[codigo];
    if (!sala) return;

    sala.jogadores.push({
      id: socket.id,
      nome
    });

    socket.join(codigo);
    io.to(codigo).emit("lista", sala.jogadores);
  });

  // ADMIN inicia o jogo
  socket.on("jogar", (codigo) => {
    const sala = salas[codigo];
    if (!sala) return;

    // Sempre escolhe UM impostor
    const impostor =
      sala.jogadores[Math.floor(Math.random() * sala.jogadores.length)];

    const palavra =
      palavras[Math.floor(Math.random() * palavras.length)];

    sala.jogadores.forEach(jogador => {
      if (jogador.id === impostor.id) {
        io.to(jogador.id).emit("resultado", "❌ VOCÊ É O IMPOSTOR");
      } else {
        io.to(jogador.id).emit("resultado", "PALAVRA: " + palavra);
      }
    });
  });

  // Desconexão
  socket.on("disconnect", () => {
    for (const codigo in salas) {
      const sala = salas[codigo];

      sala.jogadores = sala.jogadores.filter(
        j => j.id !== socket.id
      );

      if (sala.jogadores.length === 0) {
        delete salas[codigo];
      } else {
        io.to(codigo).emit("lista", sala.jogadores);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
