const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

/* ===== TEMAS ===== */
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
    "Yuji Itadori",
    "Megumi Fushiguro",
    "Nobara Kugisaki",
    "Satoru Gojo",
    "Ryomen Sukuna",
    "Maki Zenin",
    "Toge Inumaki",
    "Panda",
    "Yuta Okkotsu",
    "Masamichi Yaga",
    "Kiyotaka Ijichi",
    "Shoko Ieiri",
    "Utahime Iori",
    "Mei Mei",
    "Suguru Geto",
    "Kenjaku",
    "Mahito",
    "Jogo",
    "Hanami",
    "Dagon",
    "Choso",
    "Toji Fushiguro",
    "Naobito Zenin",
    "Naoya Zenin",
    "Mai Zenin",
    "Kokichi Muta",
    "Mechamaru",
    "Aoi Todo",
    "Kasumi Miwa",
    "Momo Nishimiya",
    "Rika Orimoto",
    "Hajime Kashimo",
    "Kinji Hakari",
    "Kirara Hoshi",
    "Hiromi Higuruma",
    "Takako Uro",
    "Ryu Ishigori",
    "Uraume",
    "Tengen",
    "Junpei Yoshino"
  ],

  hexatombe: [
    "Cellbit",
    "Abelha (Dalmo Magno)",
    "Bagi (Jae-Yoon/Maria)",
    "Bastet (Henri/Lúcio/Juan)",
    "Beamom (Kemi/Lena)",
    "Calígrafo (Labirinto/Remi)",
    "Harpia",
    "Pomba",
    "Agatha Volkomenn",
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
    "Titanic",
    "Jurassic Park",
    "O Exterminador do Futuro",
    "O Exterminador do Futuro 2",
    "De Volta para o Futuro",
    "De Volta para o Futuro 2",
    "De Volta para o Futuro 3",
    "E.T. – O Extraterrestre",
    "Forrest Gump",
    "O Rei Leão",
    "Toy Story",
    "Toy Story 2",
    "Toy Story 3",
    "Toy Story 4"
  ],

  animais: [
    "Cachorro","Gato","Cavalo","Vaca","Porco","Ovelha","Cabra",
    "Galinha","Galo","Pato","Coelho","Hamster","Leão","Tigre",
    "Elefante","Girafa","Zebra","Rinoceronte","Hipopótamo","Urso",
    "Lobo","Raposa","Macaco","Gorila","Águia","Coruja","Papagaio",
    "Cobra","Jacaré","Tartaruga","Sapo","Tubarão","Golfinho",
    "Baleia","Polvo","Caranguejo","Borboleta","Abelha","Formiga",
    "Aranha","Mosquito"
  ],

  animes: [
    "Dragon Ball",
    "Dragon Ball Z",
    "Naruto",
    "Naruto Shippuden",
    "One Piece",
    "Bleach",
    "Death Note",
    "Attack on Titan",
    "Jujutsu Kaisen",
    "Demon Slayer",
    "My Hero Academia",
    "Chainsaw Man",
    "Tokyo Ghoul",
    "Sword Art Online",
    "Hunter x Hunter",
    "Fullmetal Alchemist",
    "Haikyuu!!",
    "Your Name",
    "A Silent Voice",
    "Dr. Stone"
  ],

  gerais: [
    "Cadeira","Mesa","Sofá","Cama","Travesseiro","Cobertor","Tapete","Armário",
    "Geladeira","Fogão","Micro-ondas","Forno","Liquidificador","Ventilador",
    "Ar-condicionado","Lâmpada","Abajur","Espelho","Relógio","Calendário",
    "Telefone","Celular","Tablet","Computador","Notebook","Monitor",
    "Teclado","Mouse","Mousepad","Impressora","Scanner","Carregador",
    "Cabo","Extensão","Tomada","Bateria","Controle remoto","Caixa de som",
    "Internet","Wi-Fi","Senha","Login","Aplicativo","Site","Servidor",
    "Bug","Erro","Sistema","Arquivo","Download","Upload",
    "Sol","Lua","Estrela","Chuva","Vento","Fogo","Água","Ar",
    "Tempo","Dinheiro","Poder","Controle","Liberdade",
    "Alegria","Tristeza","Raiva","Medo","Ansiedade",
    "Ideia","Pensamento","Sonho","Verdade","Mentira"
  ]
};

/* ===== SALAS ===== */
const salas = {};

function gerarCodigo() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function palavraAleatoria(tema) {
  const lista = temas[tema] || temas.gerais;
  return lista[Math.floor(Math.random() * lista.length)];
}

/* ===== SOCKET ===== */
io.on("connection", socket => {

  socket.on("criarSala", ({ nome }) => {
    const codigo = gerarCodigo();

    salas[codigo] = {
      admin: socket.id,
      jogadores: {},
      tema: "gerais",
      palavra: "",
      impostor: "",
      round: 0,
      respostas: {},
      votos: {},
      votaram: new Set()
    };

    salas[codigo].jogadores[socket.id] = {
      nome,
      vivo: true
    };

    socket.join(codigo);
    socket.emit("salaCriada", { codigo });
    atualizarLista(codigo);
  });

  socket.on("entrarSala", ({ codigo, nome }) => {
    if (!salas[codigo]) return;

    salas[codigo].jogadores[socket.id] = {
      nome,
      vivo: true
    };

    socket.join(codigo);
    atualizarLista(codigo);
  });

  socket.on("jogar", codigo => {
    const sala = salas[codigo];
    if (!sala) return;

    sala.round = 1;
    iniciarRound(codigo);
  });

  socket.on("enviarPalavra", ({ codigo, palavra }) => {
    const sala = salas[codigo];
    if (!sala) return;

    sala.respostas[socket.id] = palavra;

    const vivos = jogadoresVivos(sala);

    io.to(codigo).emit("contadorEnvios", {
      enviados: Object.keys(sala.respostas).length,
      total: vivos.length
    });

    if (Object.keys(sala.respostas).length === vivos.length) {
      mostrarRespostas(codigo);
    }
  });

  socket.on("votar", ({ codigo, alvo }) => {
    const sala = salas[codigo];
    if (!sala || sala.votaram.has(socket.id)) return;

    sala.votaram.add(socket.id);
    sala.votos[alvo] = (sala.votos[alvo] || 0) + 1;

    const vivos = jogadoresVivos(sala);
    if (sala.votaram.size === vivos.length) {
      finalizarVotacao(codigo);
    }
  });

  socket.on("disconnect", () => {
    for (const codigo in salas) {
      if (salas[codigo].jogadores[socket.id]) {
        delete salas[codigo].jogadores[socket.id];
        atualizarLista(codigo);
      }
    }
  });
});

/* ===== FUNÇÕES ===== */
function jogadoresVivos(sala) {
  return Object.keys(sala.jogadores).filter(id => sala.jogadores[id].vivo);
}

function atualizarLista(codigo) {
  const sala = salas[codigo];
  if (!sala) return;

  io.to(codigo).emit("lista",
    Object.keys(sala.jogadores).map(id => ({
      id,
      nome: sala.jogadores[id].nome,
      vivo: sala.jogadores[id].vivo
    }))
  );
}

function iniciarRound(codigo) {
  const sala = salas[codigo];

  sala.respostas = {};
  sala.votos = {};
  sala.votaram.clear();

  const vivos = jogadoresVivos(sala);
  sala.impostor = vivos[Math.floor(Math.random() * vivos.length)];
  sala.palavra = palavraAleatoria(sala.tema);

  vivos.forEach(id => {
    io.to(id).emit("resultado", {
      tipo: id === sala.impostor ? "impostor" : "normal",
      palavra: sala.palavra
    });
  });

  let c = 3;
  const timer = setInterval(() => {
    io.to(codigo).emit("contagem", c);
    c--;
    if (c < 0) {
      clearInterval(timer);
      io.to(codigo).emit("faseEscrita", { total: vivos.length });
    }
  }, 1000);
}

function mostrarRespostas(codigo) {
  const sala = salas[codigo];
  const ids = Object.keys(sala.respostas);
  let i = 0;

  const loop = setInterval(() => {
    const id = ids[i];
    io.to(codigo).emit("mostrarResposta", {
      nome: sala.jogadores[id].nome,
      palavra: sala.respostas[id]
    });
    i++;

    if (i >= ids.length) {
      clearInterval(loop);
      avancarJogo(codigo);
    }
  }, 3000);
}

function avancarJogo(codigo) {
  const sala = salas[codigo];

  if (sala.round < 3) {
    sala.round++;
    io.to(codigo).emit("proximoRound", sala.round);
  } else {
    iniciarVotacao(codigo);
  }
}

function iniciarVotacao(codigo) {
  const sala = salas[codigo];

  io.to(codigo).emit("liberarVotacao",
    jogadoresVivos(sala).map(id => ({
      id,
      nome: sala.jogadores[id].nome,
      palavra: sala.respostas[id]
    }))
  );
}

function finalizarVotacao(codigo) {
  const sala = salas[codigo];

  let alvo = null;
  let max = 0;
  for (const id in sala.votos) {
    if (sala.votos[id] > max) {
      max = sala.votos[id];
      alvo = id;
    }
  }

  if (!alvo) return;

  sala.jogadores[alvo].vivo = false;

  const eraImpostor = alvo === sala.impostor;

  io.to(codigo).emit("eliminado", {
    mensagem: eraImpostor
      ? "🎉 O IMPOSTOR FOI ELIMINADO!"
      : "❌ Ele não era o impostor"
  });

  const vivos = jogadoresVivos(sala);

  if (vivos.length === 1 && vivos[0] === sala.impostor) {
    io.to(codigo).emit("fimJogo", { mensagem: "😈 O IMPOSTOR GANHOU!" });
  } else if (eraImpostor) {
    io.to(codigo).emit("fimJogo", { mensagem: "🏆 OS INOCENTES GANHARAM!" });
  } else {
    io.to(codigo).emit("proximoRound", sala.round);
  }
}

/* ===== START ===== */
server.listen(3000, () => {
  console.log("🔥 Server rodando");
});
