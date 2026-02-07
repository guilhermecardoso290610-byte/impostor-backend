const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let salas = {};

function gerarCodigo() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

const palavras = ["Banana", "Escola", "Carro", "Pizza", "Hospital"];

io.on("connection", (socket) => {
  socket.on("criarSala", ({ nome }) => {
    const codigo = gerarCodigo();

    salas[codigo] = {
      admin: socket.id,
      jogadores: [{ id: socket.id, nome }],
      palavra: "",
      impostor: "",
    };

    socket.join(codigo);
    socket.emit("salaCriada", codigo);
    io.to(codigo).emit("listaJogadores", salas[codigo].jogadores);
  });

  socket.on("entrarSala", ({ codigo, nome }) => {
    if (!salas[codigo]) return;

    salas[codigo].jogadores.push({ id: socket.id, nome });
    socket.join(codigo);

    io.to(codigo).emit("listaJogadores", salas[codigo].jogadores);
  });

  socket.on("iniciarJogo", (codigo) => {
    const sala = salas[codigo];
    if (!sala) return;

    const palavra = palavras[Math.floor(Math.random() * palavras.length)];
    const impostor =
      sala.jogadores[Math.floor(Math.random() * sala.jogadores.length)];

    sala.palavra = palavra;
    sala.impostor = impostor.id;

    sala.jogadores.forEach((jogador) => {
      if (jogador.id === sala.impostor) {
        io.to(jogador.id).emit("resultado", {
          papel: "impostor",
          palavra: "❌ Você é o impostor",
        });
      } else {
        io.to(jogador.id).emit("resultado", {
          papel: "civil",
          palavra,
        });
      }
    });
  });

  socket.on("disconnect", () => {
    for (const codigo in salas) {
      salas[codigo].jogadores = salas[codigo].jogadores.filter(
        (j) => j.id !== socket.id
      );

      if (salas[codigo].jogadores.length === 0) {
        delete salas[codigo];
      } else {
        io.to(codigo).emit(
          "listaJogadores",
          salas[codigo].jogadores
        );
      }
    }
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
