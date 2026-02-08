const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

/* =========================
   TEMAS / PALAVRAS
========================= */
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
    "Cachorro", "Gato", "Cavalo", "Vaca", "Porco", "Ovelha", "Cabra",
    "Galinha", "Galo", "Pato", "Coelho", "Hamster", "Leão", "Tigre",
    "Elefante", "Girafa", "Zebra", "Rinoceronte", "Hipopótamo", "Urso",
    "Lobo", "Raposa", "Macaco", "Gorila", "Águia", "Coruja", "Papagaio",
    "Cobra", "Jacaré", "Tartaruga", "Sapo", "Tubarão", "Golfinho",
    "Baleia", "Polvo", "Caranguejo", "Borboleta", "Abelha", "Formiga",
    "Aranha", "Mosquito"
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
    "Cadeira", "Mesa", "Sofá", "Cama", "Travesseiro", "Cobertor", "Tapete", "Armário",
    "Geladeira", "Fogão", "Micro-ondas", "Forno", "Liquidificador", "Ventilador",
    "Ar-condicionado", "Lâmpada", "Abajur", "Espelho", "Relógio", "Calendário",
    "Telefone", "Celular", "Tablet", "Computador", "Notebook", "Monitor",
    "Teclado", "Mouse", "Mousepad", "Impressora", "Scanner", "Carregador",
    "Cabo", "Extensão", "Tomada", "Bateria", "Controle remoto", "Caixa de som",
    "Internet", "Wi-Fi", "Senha", "Login", "Aplicativo", "Site", "Servidor",
    "Bug", "Erro", "Sistema", "Arquivo", "Download", "Upload",
    "Sol", "Lua", "Estrela", "Chuva", "Vento", "Fogo", "Água", "Ar",
    "Tempo", "Dinheiro", "Poder", "Controle", "Liberdade",
    "Alegria", "Tristeza", "Raiva", "Medo", "Ansiedade",
    "Ideia", "Pensamento", "Sonho", "Verdade", "Mentira"
  ]
};
/* =========================
   SALAS
========================= */
const salas = {};

/* =========================
   UTILS
========================= */
function gerarCodigo() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function escolher(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================
   SOCKET
========================= */
io.on("connection", socket => {
  console.log("🟢 conectado:", socket.id);

  /* ===== CRIAR SALA ===== */
  socket.on("criarSala", ({ nome }) => {
    const codigo = gerarCodigo();

    salas[codigo] = {
      codigo,
      admin: socket.id,
      palavra: "",
      impostor: "",
      jogadores: {},
      fase: "lobby",
      envios: {},
      historico: [],
      votos: {},
      votaram: {},
      timer: null
    };

    salas[codigo].jogadores[socket.id] = {
      id: socket.id,
      nome,
      vivo: true
    };

    socket.join(codigo);
    socket.emit("salaCriada", { codigo });
    atualizarLista(codigo);
  });

  /* ===== ENTRAR SALA ===== */
  socket.on("entrarSala", ({ codigo, nome }) => {
    const sala = salas[codigo];
    if (!sala) return;

    sala.jogadores[socket.id] = {
      id: socket.id,
      nome,
      vivo: true
    };

    socket.join(codigo);
    atualizarLista(codigo);
  });

  /* ===== ATUALIZAR LISTA ===== */
  function atualizarLista(codigo) {
    const sala = salas[codigo];
    if (!sala) return;

    io.to(codigo).emit(
      "lista",
      Object.values(sala.jogadores).filter(j => j.vivo)
    );
  }

  /* ===== INICIAR JOGO ===== */
  socket.on("jogar", codigo => {
    const sala = salas[codigo];
    if (!sala) return;
    if (socket.id !== sala.admin) return;

    iniciarRound(codigo);
  });

  /* =========================
     ROUND
  ========================= */
  function iniciarRound(codigo) {
    const sala = salas[codigo];

    sala.fase = "palavra";
    sala.envios = {};
    sala.votos = {};
    sala.votaram = {};

    const vivos = Object.values(sala.jogadores).filter(j => j.vivo);
    sala.palavra = escolher(temas.geral);
    sala.impostor = escolher(vivos).id;

    vivos.forEach(j => {
      if (j.id === sala.impostor) {
        io.to(j.id).emit("resultado", { tipo: "impostor" });
      } else {
        io.to(j.id).emit("resultado", {
          tipo: "normal",
          palavra: sala.palavra
        });
      }
    });

    let cont = 3;
    const intervalo = setInterval(() => {
      io.to(codigo).emit("contagem", cont);
      cont--;
      if (cont < 0) {
        clearInterval(intervalo);
        sala.fase = "escrita";
        io.to(codigo).emit("faseEscrita", vivos.length);
      }
    }, 1000);
  }

  /* ===== IMPOSTOR VER PALAVRA (J) ===== */
  socket.on("pedirPalavra", codigo => {
    const sala = salas[codigo];
    if (!sala) return;
    if (socket.id !== sala.impostor) return;

    socket.emit("palavraSecreta", sala.palavra);
  });

  /* ===== ENVIAR PALAVRA ===== */
  socket.on("enviarPalavra", ({ codigo, palavra }) => {
    const sala = salas[codigo];
    if (!sala) return;
    if (sala.fase !== "escrita") return;
    if (sala.envios[socket.id]) return;

    sala.envios[socket.id] = palavra;

    io.to(codigo).emit("contadorEnvios", {
      enviados: Object.keys(sala.envios).length
    });

    const vivos = Object.values(sala.jogadores).filter(j => j.vivo);

    if (Object.keys(sala.envios).length === vivos.length) {
      sala.fase = "mostrar";

      vivos.forEach(j => {
        const texto = sala.envios[j.id];
        sala.historico.push({
          nome: j.nome,
          palavra: texto
        });

        io.to(codigo).emit("mostrarResposta", {
          nome: j.nome,
          palavra: texto
        });
      });

      setTimeout(() => iniciarVotacao(codigo), 3000);
    }
  });

  /* =========================
     VOTAÇÃO
  ========================= */
  function iniciarVotacao(codigo) {
    const sala = salas[codigo];
    sala.fase = "votacao";
    sala.votos = {};
    sala.votaram = {};

    Object.values(sala.jogadores)
      .filter(j => j.vivo)
      .forEach(j => (sala.votos[j.id] = 0));

    io.to(codigo).emit("iniciarVotacao", {
      jogadores: Object.values(sala.jogadores).filter(j => j.vivo),
      historico: sala.historico,
      tempo: 150
    });

    let tempo = 150;
    sala.timer = setInterval(() => {
      tempo--;
      io.to(codigo).emit("cronometro", tempo);

      if (tempo <= 0) {
        clearInterval(sala.timer);
        finalizarVotacao(codigo);
      }
    }, 1000);
  }

  socket.on("votar", ({ codigo, alvo }) => {
    const sala = salas[codigo];
    if (!sala) return;
    if (sala.fase !== "votacao") return;
    if (sala.votaram[socket.id]) return;

    sala.votaram[socket.id] = true;
    sala.votos[alvo]++;

    io.to(codigo).emit("atualizarVotos", sala.votos);
  });

  function finalizarVotacao(codigo) {
    const sala = salas[codigo];
    sala.fase = "resultado";

    let maisVotado = null;
    let max = -1;

    for (let id in sala.votos) {
      if (sala.votos[id] > max) {
        max = sala.votos[id];
        maisVotado = id;
      }
    }

    if (maisVotado) {
      sala.jogadores[maisVotado].vivo = false;
      io.to(codigo).emit("eliminado", sala.jogadores[maisVotado].nome);
    }

    const vivos = Object.values(sala.jogadores).filter(j => j.vivo);

    if (vivos.length <= 1 || !vivos.find(j => j.id === sala.impostor)) {
      io.to(codigo).emit("fimDeJogo", {
        impostor: sala.jogadores[sala.impostor]?.nome
      });
      return;
    }

    setTimeout(() => iniciarRound(codigo), 3000);
  }

  /* ===== DESCONECTAR ===== */
  socket.on("disconnect", () => {
    for (const codigo in salas) {
      const sala = salas[codigo];
      if (sala.jogadores[socket.id]) {
        delete sala.jogadores[socket.id];
        atualizarLista(codigo);
      }
    }
  });
});

/* ========================= */
server.listen(3000, () => {
  console.log("🔥 servidor rodando na porta 3000");
});
