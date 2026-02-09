const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const salas = {};

/* ================= TEMAS COMPLETOS ================= */

const TEMAS = {

  clashroyale: [
    "Arqueiras","Rei Esqueleto","Rainha Arqueira","Campeão Dourado","Cavaleiro",
    "Mini P.E.K.K.A","P.E.K.K.A","Príncipe","Príncipe das Trevas","Valquíria",
    "Gigante","Gigante Real","Gigante Elétrico","Golem","Golem de Gelo",
    "Balão","Corredor","Porcos Reais","Barril de Goblins","Goblins",
    "Goblins Lanceiros","Goblin com Dardo","Goblin Gigante","Servos",
    "Horda de Servos","Esqueletos","Exército de Esqueletos","Morcegos",
    "Bruxa","Bruxa Sombria","Mago","Mago Elétrico","Mago de Gelo",
    "Executor","Caçador","Mosqueteira","Três Mosqueteiras","Arqueiro Mágico",
    "Bebê Dragão","Dragão Infernal","Dragão Elétrico","Mineiro","Lenhador",
    "Bandida","Fantasma Real","Fênix","Espírito de Fogo","Espírito de Gelo",
    "Guardas","Recrutas Reais","Bola de Fogo","Flechas","Zap","Veneno",
    "Relâmpago","Foguete","Congelamento","Tornado","Cemitério",
    "Canhão","Torre Tesla","Torre Inferno","Morteiro","X-Besta"
  ],

  jujutsu: [
    "Yuji Itadori","Megumi Fushiguro","Nobara Kugisaki","Satoru Gojo","Ryomen Sukuna",
    "Maki Zenin","Toge Inumaki","Panda","Yuta Okkotsu","Suguru Geto",
    "Kenjaku","Mahito","Jogo","Hanami","Dagon","Choso","Toji Fushiguro",
    "Naobito Zenin","Mai Zenin","Aoi Todo","Kasumi Miwa","Rika Orimoto"
  ],

  hexatombe: [
    "Cellbit","Bagi","Bastet","Beamom","Calígrafo","Harpia","Pomba",
    "Agatha","Rakin","Dalmo","Jae-Yoon","Kemi","Labirinto","Cleo",
    "Cristino","Mosto","Tarrafa","Raziel","Zéfero","Manu","Aniquilação",
    "Arara Sangrenta","Kerberos","Quibungo","Zumbi de Sangue"
  ],

  filmes: [
    "Titanic","Jurassic Park","O Exterminador do Futuro",
    "De Volta para o Futuro","Forrest Gump","O Rei Leão",
    "Toy Story","Harry Potter","Vingadores","Homem-Aranha",
    "Batman","Coringa","Matrix","Interestelar"
  ],

  animais: [
    "Cachorro","Gato","Cavalo","Vaca","Porco","Ovelha","Coelho",
    "Leão","Tigre","Elefante","Girafa","Zebra","Urso","Lobo",
    "Raposa","Macaco","Águia","Coruja","Cobra","Jacaré",
    "Tubarão","Golfinho","Baleia","Polvo","Borboleta","Abelha"
  ],

  animes: [
    "Dragon Ball","Naruto","One Piece","Bleach","Death Note",
    "Attack on Titan","Jujutsu Kaisen","Demon Slayer",
    "My Hero Academia","Chainsaw Man","Tokyo Ghoul",
    "Hunter x Hunter","Fullmetal Alchemist","Haikyuu"
  ],

  gerais: [
    "Cadeira","Mesa","Sofá","Cama","Travesseiro","Geladeira","Fogão",
    "Computador","Notebook","Teclado","Mouse","Celular","Internet",
    "Wi-Fi","Senha","Aplicativo","Servidor","Software","Bug","Erro",
    "Arquivo","Download","Upload","Relógio","Chave","Carteira",
    "Óculos","Mochila","Guarda-chuva","Tênis"
  ]
};

/* ================= FUNÇÃO PALAVRA ================= */

function escolherPalavra() {
  const temas = Object.keys(TEMAS);
  const tema = temas[Math.floor(Math.random() * temas.length)];
  const lista = TEMAS[tema];
  return lista[Math.floor(Math.random() * lista.length)];
}

/* ================= SOCKET ================= */

io.on("connection", (socket) => {

  socket.on("criarSala", (codigo, nome) => {
    salas[codigo] = {
      jogadores: [],
      palavra: "",
      impostor: null,
      votos: {},
      emVotacao: false
    };

    socket.join(codigo);
    salas[codigo].jogadores.push({ id: socket.id, nome });

    socket.data.sala = codigo;
    socket.data.nome = nome;

    io.to(codigo).emit("atualizarJogadores", salas[codigo].jogadores);
  });

  socket.on("entrarSala", (codigo, nome) => {
    if (!salas[codigo]) return;

    socket.join(codigo);
    salas[codigo].jogadores.push({ id: socket.id, nome });

    socket.data.sala = codigo;
    socket.data.nome = nome;

    io.to(codigo).emit("atualizarJogadores", salas[codigo].jogadores);
  });

  socket.on("comecarRodada", () => {
    const sala = salas[socket.data.sala];
    if (!sala) return;

    sala.palavra = escolherPalavra();
    sala.votos = {};
    sala.emVotacao = false;

    const jogadores = sala.jogadores;
    const impostorIndex = Math.floor(Math.random() * jogadores.length);
    sala.impostor = jogadores[impostorIndex].id;

    jogadores.forEach(j => {
      if (j.id === sala.impostor) {
        io.to(j.id).emit("receberPalavra", "IMPOSTOR");
      } else {
        io.to(j.id).emit("receberPalavra", sala.palavra);
      }
    });
  });

  socket.on("iniciarVotacao", () => {
    const sala = salas[socket.data.sala];
    if (!sala) return;

    sala.emVotacao = true;
    sala.votos = {};

    io.to(socket.data.sala).emit("votacaoIniciada");
  });

  socket.on("votar", (idVotado) => {
    const sala = salas[socket.data.sala];
    if (!sala || !sala.emVotacao) return;

    sala.votos[socket.id] = idVotado;

    if (Object.keys(sala.votos).length === sala.jogadores.length) {

      const contagem = {};

      Object.values(sala.votos).forEach(v => {
        contagem[v] = (contagem[v] || 0) + 1;
      });

      let maisVotado = null;
      let max = 0;

      for (let id in contagem) {
        if (contagem[id] > max) {
          max = contagem[id];
          maisVotado = id;
        }
      }

      const eraImpostor = maisVotado === sala.impostor;

      io.to(socket.data.sala).emit("resultadoVotacao", {
        expulso: maisVotado,
        eraImpostor,
        impostor: sala.impostor,
        palavra: sala.palavra
      });
    }
  });

  socket.on("disconnect", () => {
    const salaCodigo = socket.data.sala;
    if (!salas[salaCodigo]) return;

    salas[salaCodigo].jogadores =
      salas[salaCodigo].jogadores.filter(j => j.id !== socket.id);

    io.to(salaCodigo).emit("atualizarJogadores", salas[salaCodigo].jogadores);
  });
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
