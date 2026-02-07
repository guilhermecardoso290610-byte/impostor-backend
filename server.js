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
//   jogadores: [{ id, nome }],
//   tema: "clashroyale"
// }
let salas = {};

/* ================== TEMAS ================== */

const temas = {
  clashroyale: [
    "Arqueiras (3 elixir)",
    "Rei Esqueleto (4 elixir)",
    "Rainha Arqueira (5 elixir)",
    "Campeão Dourado (4 elixir)",
    "Cavaleiro (3 elixir)",
    "Mini P.E.K.K.A (4 elixir)",
    "P.E.K.K.A (7 elixir)",
    "Príncipe (5 elixir)",
    "Valquíria (4 elixir)",
    "Gigante (5 elixir)",
    "Balão (5 elixir)",
    "Corredor (4 elixir)",
    "Mineiro (3 elixir)",
    "Bandida (3 elixir)",
    "Foguete (6 elixir)",
    "Tornado (3 elixir)",
    "X-Besta (6 elixir)"
  ],

  jujutsu: [
    "Yuji Itadori","Megumi Fushiguro","Nobara Kugisaki",
    "Satoru Gojo","Ryomen Sukuna","Maki Zenin",
    "Toge Inumaki","Panda","Yuta Okkotsu",
    "Suguru Geto","Kenjaku","Mahito","Toji Fushiguro",
    "Aoi Todo","Kinji Hakari","Hajime Kashimo",
    "Tengen","Junpei Yoshino"
  ],

  hexatombe: [
    "Cellbit","Abelha","Bagi","Bastet","Beamom",
    "Calígrafo","LJoga","Rakin","Dalmo Magno",
    "Jae-Yoon","Labirinto","Cleo Brisa","Mosto",
    "Aniquilação","Kerberos","Zumbi de Sangue"
  ],

  filmes: [
    "Matrix","Vingadores","Star Wars",
    "Jurassic Park","Harry Potter",
    "O Senhor dos Anéis","Avatar","Batman"
  ],

  animais: [
    "Cachorro","Gato","Leão","Tigre",
    "Elefante","Cobra","Águia","Tubarão"
  ]
};

/* ================== FUNÇÕES ================== */

function gerarCodigo() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

/* ================== SOCKET ================== */

io.on("connection", (socket) => {
  console.log("Conectado:", socket.id);

  // ===== CRIAR SALA =====
  socket.on("criarSala", ({ nome }) => {
    const codigo = gerarCodigo();

    salas[codigo] = {
      admin: socket.id,
      jogadores: [{ id: socket.id, nome }],
      tema: "clashroyale"
    };

    socket.join(codigo);

    socket.emit("salaCriada", codigo);
    io.to(codigo).emit("lista", salas[codigo].jogadores);
  });

  // ===== ENTRAR NA SALA =====
  socket.on("entrarSala", ({ codigo, nome }) => {
    const sala = salas[codigo];
    if (!sala) return;

    sala.jogadores.push({ id: socket.id, nome });
    socket.join(codigo);

    io.to(codigo).emit("lista", sala.jogadores);
  });

  // ===== MUDAR TEMA (SÓ ADMIN) =====
  socket.on("mudarTema", ({ codigo, tema }) => {
    const sala = salas[codigo];
    if (!sala) return;
    if (socket.id !== sala.admin) return;
    if (!temas[tema]) return;

    sala.tema = tema;
  });

  // ===== JOGAR =====
  socket.on("jogar", (codigo) => {
    const sala = salas[codigo];
    if (!sala) return;
    if (socket.id !== sala.admin) return;
    if (sala.jogadores.length < 2) return;

    const lista = temas[sala.tema] || temas.clashroyale;
    const palavra = lista[Math.floor(Math.random() * lista.length)];

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

  // ===== EXPULSAR =====
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

/* ================== START ================== */

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
