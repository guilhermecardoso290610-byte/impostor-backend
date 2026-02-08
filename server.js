const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// salas[codigo] = {
//   admin,
//   jogadores: [{ id, nome }],
//   tema,
//   ultimoImpostor
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
    "Yuji Itadori","Megumi Fushiguro","Nobara Kugisaki","Satoru Gojo",
    "Ryomen Sukuna","Maki Zenin","Toge Inumaki","Panda","Yuta Okkotsu",
    "Masamichi Yaga","Kiyotaka Ijichi","Shoko Ieiri","Utahime Iori",
    "Mei Mei","Suguru Geto","Kenjaku","Mahito","Jogo","Hanami",
    "Dagon","Choso","Toji Fushiguro","Naobito Zenin","Naoya Zenin",
    "Mai Zenin","Kokichi Muta","Mechamaru","Aoi Todo","Kasumi Miwa",
    "Momo Nishimiya","Rika Orimoto","Hajime Kashimo","Kinji Hakari",
    "Kirara Hoshi","Hiromi Higuruma","Takako Uro","Ryu Ishigori",
    "Uraume","Tengen","Junpei Yoshino"
  ],

  hexatombe: [
    "Cellbit","Abelha (Dalmo Magno)","Bagi (Jae-Yoon/Maria)",
    "Bastet (Henri/Lúcio/Juan)","Beamom (Kemi/Lena)",
    "Calígrafo (Labirinto/Remi)","Harpia","Pomba",
    "Agatha Volkomenn","LJoga (Damir Lukic)","Rakin (Dante)",
    "Dalmo Magno","Jae-Yoon","Jonas Aguiar","Kemi","Labirinto",
    "Cleo Brisa","Cristino","Giovanni Opspor","Mosto","Tarrafa",
    "Nando","Alvira","Raziel","Sabara","Velisar","Zéfero",
    "Helen Magno","Manu Magno","Paçoqueiro","Aniquilação",
    "Anulado","Arara Sangrenta","Kerberos","Quibungo",
    "Zumbi de Sangue"
  ],

  filmes: [
    "Titanic","Jurassic Park","O Exterminador do Futuro",
    "O Exterminador do Futuro 2","De Volta para o Futuro",
    "De Volta para o Futuro 2","De Volta para o Futuro 3",
    "E.T. – O Extraterrestre","Forrest Gump","O Rei Leão",
    "Toy Story","Toy Story 2","Toy Story 3","Toy Story 4"
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
    "Dragon Ball","Dragon Ball Z","Naruto","Naruto Shippuden",
    "One Piece","Bleach","Death Note","Attack on Titan",
    "Jujutsu Kaisen","Demon Slayer","My Hero Academia",
    "Chainsaw Man","Tokyo Ghoul","Sword Art Online",
    "Hunter x Hunter","Fullmetal Alchemist","Haikyuu!!",
    "Your Name","A Silent Voice","Dr. Stone"
  ],

  gerais: [
    "Cadeira","Mesa","Sofá","Cama","Travesseiro","Cobertor","Tapete","Armário",
    "Geladeira","Fogão","Micro-ondas","Forno","Liquidificador","Ventilador",
    "Ar-condicionado","Lâmpada","Abajur","Espelho","Relógio","Calendário",
    "Telefone","Celular","Tablet","Computador","Notebook","Monitor",
    "Teclado","Mouse","Mousepad","Impressora","Scanner","Carregador",
    "Caderno","Caneta","Lápis","Borracha","Livro","Mochila",
    "Casa","Rua","Cidade","Escola","Hospital","Supermercado",
    "Carro","Moto","Ônibus","Trem","Avião","Internet","Senha",
    "Sol","Lua","Mar","Floresta","Montanha","Chuva",
    "Arroz","Feijão","Pizza","Hambúrguer","Café","Água",
    "Correr","Dormir","Viajar","Trabalhar","Estudar",
    "Tempo","Dinheiro","Segredo","Erro","Solução",
    "Alegria","Raiva","Medo","Coragem","Dúvida",
    "Ideia","Sonho","Verdade","Mentira","Vitória","Fracasso"
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
      tema: "clashroyale",
      ultimoImpostor: null
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

  // ===== MUDAR TEMA (ADMIN) =====
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

    if (sala.jogadores.length < 2) {
      io.to(socket.id).emit("resultado", {
        tipo: "erro",
        palavra: "Precisa de pelo menos 2 jogadores"
      });
      return;
    }

    const lista = temas[sala.tema] || temas.clashroyale;
    const palavra = lista[Math.floor(Math.random() * lista.length)];

    // ===== NÃO REPETE IMPOSTOR =====
    let candidatos = [...sala.jogadores];

    if (sala.ultimoImpostor) {
      candidatos = candidatos.filter(
        j => j.id !== sala.ultimoImpostor
      );
    }

    if (candidatos.length === 0) {
      candidatos = [...sala.jogadores];
    }

    const impostor =
      candidatos[Math.floor(Math.random() * candidatos.length)];

    sala.ultimoImpostor = impostor.id;

    // ===== ENVIA RESULTADO =====
    sala.jogadores.forEach(j => {
      if (j.id === impostor.id) {
        io.to(j.id).emit("resultado", {
          tipo: "impostor",
          palavra: palavra
        });
      } else {
        io.to(j.id).emit("resultado", {
          tipo: "normal",
          palavra: palavra
        });
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
