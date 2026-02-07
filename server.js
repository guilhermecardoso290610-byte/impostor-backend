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
"Príncipe das Trevas (4 elixir)",
"Valquíria (4 elixir)",
"Gigante (5 elixir)",
"Gigante Real (6 elixir)",
"Gigante Elétrico (7 elixir)",
"Golem (8 elixir)",
"Golem de Gelo (2 elixir)",
"Golem de Elixir (3 elixir)",
"Balão (5 elixir)",
"Corredor (4 elixir)",
"Corredor Montado (5 elixir)",
"Porcos Reais (5 elixir)",
"Barril de Goblins (3 elixir)",
"Goblins (2 elixir)",
"Goblins Lanceiros (2 elixir)",
"Goblin com Dardo (3 elixir)",
"Goblin Gigante (6 elixir)",
"Goblin Broca (4 elixir)",
"Gangue de Goblins (3 elixir)",
"Servos (3 elixir)",
"Horda de Servos (5 elixir)",
"Esqueletos (1 elixir)",
"Exército de Esqueletos (3 elixir)",
"Esqueleto Gigante (6 elixir)",
"Morcegos (2 elixir)",
"Bruxa (5 elixir)",
"Bruxa Sombria (4 elixir)",
"Mago (5 elixir)",
"Mago Elétrico (4 elixir)",
"Mago de Gelo (3 elixir)",
"Mago da Fênix (4 elixir)",
"Executor (5 elixir)",
"Caçador (4 elixir)",
"Mosqueteira (4 elixir)",
"Três Mosqueteiras (9 elixir)",
"Arqueiro Mágico (4 elixir)",
"Bebê Dragão (4 elixir)",
"Dragão Infernal (4 elixir)",
"Dragão Elétrico (5 elixir)",
"Dragão do Esqueleto (4 elixir)",
"Mineiro (3 elixir)",
"Mineiro Poderoso (4 elixir)",
"Lenhador (4 elixir)",
"Bandida (3 elixir)",
"Fantasma Real (3 elixir)",
"Curadora Guerreira (4 elixir)",
"Monge (5 elixir)",
"Fênix (4 elixir)",
"Fisherman (3 elixir)",
"Carrinho de Canhão (5 elixir)",
"Carrinho de Goblins (5 elixir)",
"Espírito de Fogo (1 elixir)",
"Espírito de Gelo (1 elixir)",
"Espírito Elétrico (1 elixir)",
"Espírito Curativo (1 elixir)",
"Guardas (3 elixir)",
"Recrutas Reais (7 elixir)",
"Aríete de Batalha (4 elixir)",
"Máquina Voadora (4 elixir)",
"Porco Gigante (6 elixir)",
"Bola de Fogo (4 elixir)",
"Flechas (3 elixir)",
"Zap (2 elixir)",
"Bola de Neve (2 elixir)",
"Veneno (4 elixir)",
"Relâmpago (6 elixir)",
"Foguete (6 elixir)",
"Terremoto (3 elixir)",
"Clone (3 elixir)",
"Espelho (variável)",
"Congelamento (4 elixir)",
"Fúria (2 elixir)",
"Tornado (3 elixir)",
"Cemitério (5 elixir)",
"Barril de Bárbaro (2 elixir)",
"Entrega Real (3 elixir)",
"Canhão (3 elixir)",
"Torre Tesla (4 elixir)",
"Cabana de Goblins (5 elixir)",
"Cabana de Bárbaros (7 elixir)",
"Forno (4 elixir)",
"Coletor de Elixir (6 elixir)",
"Jaula de Goblin (4 elixir)",
"Torre Inferno (5 elixir)",
"Bomb Tower (4 elixir)",
"Morteiro (4 elixir)",
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
   "Cellbit",
"Abelha (Dalmo Magno)",
"Bagi (Jae-Yoon/Maria)",
"Bastet (Henri/Lúcio/Juan)",
"Beamom (Kemi/Lena)",
"Calígrafo (Labirinto/Remi)",
" (Harpia)",
" (Pomba)",
" (Agatha Volkomenn)",
"LJoga (Damir Lukic)",
"Rakin (Dante)",
"Dalmo Magno",
"Jae-Yoon",
"Jonas Aguiar",
"Kemi",
"Labirinto",
"Cleo Brisa",
"Cristino",
"Giovanni Opspor",
"Mosto",
"Tarrafa",
"Nando",
"Alvira",
"Raziel",
"Sabara",
"Velisar",
"Zéfero",
"Helen Magno",
"Manu Magno",
"Paçoqueiro",
"Aniquilação",
"Anulado",
"Arara Sangrenta",
"Kerberos",
"Quibungo",
"Zumbi de Sangue"
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

