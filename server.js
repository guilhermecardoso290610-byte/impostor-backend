const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// salas[codigo] = {
//   admin: socketId,
//   jogadores: [{ id, nome }]
// }
let salas = {};

const palavras = [
  "Banana", "Carro", "Escola", "Pizza", "Hospital",
  "Cinema", "Praia", "Aeroporto", "Celular", "Computador",
  "Cachorro", "Gato", "Brasil", "Futebol", "Hambúrguer",
  "Dinheiro", "Hotel", "Restaurante", "Ônibus", "Avião"
];

function gerarCodigo() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

io.on("connection", (socket) => {
  console.log("Conectado:", socket.id);

  // ===== CRIAR SALA (ADMIN) =====
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

  // ===== ENTRAR NA SALA (GUEST) =====
  socket.on("entrarSala", ({ codigo, nome }) => {
    const sala = salas[codigo];
    if (!sala) return;

    sala.jogadores.push({ id: socket.id, nome });
    socket.join(codigo);

    io.to(codigo).emit("lista", sala.jogadores);
  });

  // ===== JOGAR (SÓ ADMIN) =====
  socket.on("jogar", (codigo) => {
    const sala = salas[codigo];
    if (!sala) return;
    if (socket.id !== sala.admin) return;

    const palavra = palavras[Math.floor(Math.random() * palavras.length)];

    // SEMPRE escolhe 1 impostor
    const impostor =
      sala.jogadores[Math.floor(Math.random() * sala.jogadores.length)];

    sala.jogadores.forEach(j => {
      if (j.id === impostor.id) {
        io.to(j.id).emit("resultado", "❌ VOCÊ É O IMPOSTOR");
      } else {
        io.to(j.id).emit("resultado", "PALAVRA: " + palavra);
      }
    });
  });

  // ===== EXPULSAR JOGADOR (ADMIN) =====
  socket.on("expulsar", ({ codigo, jogadorId }) => {
    const sala = salas[codigo];
    if (!sala) return;
    if (socket.id !== sala.admin) return;

    sala.jogadores = sala.jogadores.filter(j => j.id !== jogadorId);

    io.to(jogadorId).emit("expulso");
    io.sockets.sockets.get(jogadorId)?.leave(codigo);

    io.to(codigo).emit("lista", sala.jogadores);
  });

  // ===== DESCONECTAR =====
  socket.on("disconnect", () => {
    for (const codigo in salas) {
      const sala = salas[codigo];

      sala.jogadores = sala.jogadores.filter(j => j.id !== socket.id);

      // se admin saiu, passa admin pro primeiro
      if (sala.admin === socket.id && sala.jogadores.length > 0) {
        sala.admin = sala.jogadores[0].id;
      }

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
