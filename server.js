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
   "Yuji Itadori", "Megumi Fushiguro", "Nobara Kugisaki", "Satoru Gojo", "Ryomen Sukuna", "Maki Zenin", "Toge Inumaki", "Panda", "Yuta Okkotsu", "Masamichi Yaga", "Kiyotaka Ijichi", "Shoko Ieiri", "Utahime Iori", "Mei Mei", "Suguru Geto", "Kenjaku", "Mahito", "Jogo", "Hanami", "Dagon", "Choso", "Toji Fushiguro", "Naobito Zenin", "Naoya Zenin", "Mai Zenin",  "Kokichi Muta", "Mechamaru", "Aoi Todo", "Kasumi Miwa", "Momo Nishimiya", "Mai Zenin", "Rika Orimoto", "Hajime Kashimo", "Kinji Hakari", "Kirara Hoshi", "Hiromi Higuruma", "Takako Uro", "Ryu Ishigori", "Uraume", "Tengen", "Junpei Yoshino", 
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
  // clássicos
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
  "Toy Story 4",
  "Procurando Nemo",
  "Procurando Dory",
  "A Bela e a Fera",
  "Aladdin",
  "A Pequena Sereia",
  "Mulan",
  "Hércules",

  // ação / aventura
  "Indiana Jones",
  "Indiana Jones e a Arca Perdida",
  "Indiana Jones e o Templo da Perdição",
  "Indiana Jones e a Última Cruzada",
  "Matrix",
  "Matrix Reloaded",
  "Matrix Revolutions",
  "Mad Max",
  "Mad Max 2",
  "Mad Max: Estrada da Fúria",
  "Piratas do Caribe",
  "Piratas do Caribe: A Maldição do Pérola Negra",
  "Piratas do Caribe: O Baú da Morte",
  "Piratas do Caribe: No Fim do Mundo",
  "Piratas do Caribe: Navegando em Águas Misteriosas",

  // super-heróis
  "Homem de Ferro",
  "Homem de Ferro 2",
  "Homem de Ferro 3",
  "Capitão América: O Primeiro Vingador",
  "Capitão América: O Soldado Invernal",
  "Capitão América: Guerra Civil",
  "Thor",
  "Thor: O Mundo Sombrio",
  "Thor: Ragnarok",
  "Thor: Amor e Trovão",
  "Os Vingadores",
  "Vingadores: Era de Ultron",
  "Vingadores: Guerra Infinita",
  "Vingadores: Ultimato",
  "Homem-Aranha",
  "Homem-Aranha 2",
  "Homem-Aranha 3",
  "Homem-Aranha: De Volta ao Lar",
  "Homem-Aranha: Longe de Casa",
  "Homem-Aranha: Sem Volta Para Casa",
  "Batman Begins",
  "Batman: O Cavaleiro das Trevas",
  "Batman: O Cavaleiro das Trevas Ressurge",

  // fantasia
  "Harry Potter e a Pedra Filosofal",
  "Harry Potter e a Câmara Secreta",
  "Harry Potter e o Prisioneiro de Azkaban",
  "Harry Potter e o Cálice de Fogo",
  "Harry Potter e a Ordem da Fênix",
  "Harry Potter e o Enigma do Príncipe",
  "Harry Potter e as Relíquias da Morte – Parte 1",
  "Harry Potter e as Relíquias da Morte – Parte 2",
  "O Senhor dos Anéis: A Sociedade do Anel",
  "O Senhor dos Anéis: As Duas Torres",
  "O Senhor dos Anéis: O Retorno do Rei",
  "O Hobbit: Uma Jornada Inesperada",
  "O Hobbit: A Desolação de Smaug",
  "O Hobbit: A Batalha dos Cinco Exércitos",
  "As Crônicas de Nárnia",
  "As Crônicas de Nárnia: O Leão, a Feiticeira e o Guarda-Roupa",

  // ficção científica
  "Star Wars: Uma Nova Esperança",
  "Star Wars: O Império Contra-Ataca",
  "Star Wars: O Retorno de Jedi",
  "Star Wars: A Ameaça Fantasma",
  "Star Wars: Ataque dos Clones",
  "Star Wars: A Vingança dos Sith",
  "Star Wars: O Despertar da Força",
  "Star Wars: Os Últimos Jedi",
  "Star Wars: A Ascensão Skywalker",
  "Avatar",
  "Avatar: O Caminho da Água",
  "Duna",
  "Duna: Parte Dois",

  // terror
  "O Exorcista",
  "Halloween",
  "Sexta-Feira 13",
  "A Hora do Pesadelo",
  "It: A Coisa",
  "It: Capítulo Dois",
  "Jogos Mortais",
  "Jogos Mortais 2",
  "Jogos Mortais 3",
  "Invocação do Mal",
  "Invocação do Mal 2",
  "Invocação do Mal 3",

  // comédia / outros
  "As Branquelas",
  "Se Beber, Não Case",
  "Se Beber, Não Case 2",
  "Se Beber, Não Case 3",
  "Velozes e Furiosos",
  "Velozes e Furiosos 2",
  "Velozes e Furiosos: Desafio em Tóquio",
  "Velozes e Furiosos 5",
  "Velozes e Furiosos 6",
  "Velozes e Furiosos 7",
  "Velozes e Furiosos 8",
  "Velozes e Furiosos 9"
  ],

  animais: [
    // domésticos
  "Cachorro",
  "Gato",
  "Cavalo",
  "Vaca",
  "Porco",
  "Ovelha",
  "Cabra",
  "Galinha",
  "Galo",
  "Pato",
  "Coelho",
  "Hamster",

  // selvagens (terrestres)
  "Leão",
  "Tigre",
  "Elefante",
  "Girafa",
  "Zebra",
  "Rinoceronte",
  "Hipopótamo",
  "Urso",
  "Urso Polar",
  "Lobo",
  "Raposa",
  "Hiena",
  "Leopardo",
  "Onça-pintada",
  "Pantera",
  "Guepardo",
  "Macaco",
  "Gorila",
  "Chimpanzé",
  "Babuíno",
  "Canguru",
  "Coala",
  "Panda",
  "Veado",
  "Alce",
  "Búfalo",
  "Bisão",
  "Javali",
  "Tamanduá",
  "Preguiça",
  "Capivara",

  // aves
  "Águia",
  "Falcão",
  "Coruja",
  "Papagaio",
  "Arara",
  "Canário",
  "Pombo",
  "Flamingo",
  "Pinguim",
  "Avestruz",
  "Ganso",
  "Cisne",
  "Pavão",
  "Galinha-d'angola",

  // répteis
  "Cobra",
  "Jacaré",
  "Crocodilo",
  "Lagarto",
  "Iguana",
  "Camaleão",
  "Tartaruga",
  "Tartaruga-marinha",
  "Jiboia",
  "Píton",
  "Cobra Coral",
  "Cobra Cascavel",

  // anfíbios
  "Sapo",
  "Rã",
  "Perereca",
  "Salamandra",

  // aquáticos / marinhos
  "Tubarão",
  "Golfinho",
  "Baleia",
  "Orca",
  "Peixe",
  "Peixe-palhaço",
  "Peixe-espada",
  "Atum",
  "Sardinha",
  "Polvo",
  "Lula",
  "Água-viva",
  "Estrela-do-mar",
  "Cavalo-marinho",
  "Caranguejo",
  "Lagosta",
  "Camarão",
  "Foca",
  "Leão-marinho",
  "Morsa",

  // insetos / pequenos
  "Borboleta",
  "Abelha",
  "Formiga",
  "Joaninha",
  "Grilo",
  "Gafanhoto",
  "Besouro",
  "Aranha",
  "Escorpião",
  "Mosca",
  "Mosquito"
  ]

  animes: [
  // clássicos eternos
  "Dragon Ball",
  "Dragon Ball Z",
  "Dragon Ball GT",
  "Dragon Ball Super",
  "Naruto",
  "Naruto Shippuden",
  "One Piece",
  "Bleach",
  "Yu Yu Hakusho",
  "Cavaleiros do Zodíaco",
  "Sailor Moon",
  "Pokémon",
  "Digimon Adventure",
  "Digimon Adventure 02",
  "Inuyasha",
  "Ranma ½",
  "Death Note",
  "Fullmetal Alchemist",
  "Fullmetal Alchemist: Brotherhood",

  // ação / shounen
  "Attack on Titan",
  "Attack on Titan Final Season",
  "Jujutsu Kaisen",
  "Jujutsu Kaisen 0",
  "Demon Slayer",
  "Demon Slayer: Mugen Train",
  "My Hero Academia",
  "My Hero Academia 2",
  "My Hero Academia 3",
  "My Hero Academia 4",
  "My Hero Academia 5",
  "My Hero Academia 6",
  "Black Clover",
  "Chainsaw Man",
  "Tokyo Ghoul",
  "Tokyo Ghoul √A",
  "Tokyo Ghoul:re",
  "Fire Force",
  "Blue Exorcist",
  "Akame ga Kill",
  "Fairy Tail",
  "Fairy Tail Zero",
  "Fairy Tail Final Series",

  // aventura / fantasia
  "Sword Art Online",
  "Sword Art Online II",
  "Sword Art Online Alicization",
  "No Game No Life",
  "Re:Zero",
  "Overlord",
  "That Time I Got Reincarnated as a Slime",
  "The Rising of the Shield Hero",
  "Hunter x Hunter",
  "Hunter x Hunter (2011)",
  "Magi",
  "Magi: The Kingdom of Magic",
  "Seven Deadly Sins",
  "Seven Deadly Sins: Revival of the Commandments",
  "Seven Deadly Sins: Wrath of the Gods",

  // suspense / psicológico
  "Steins;Gate",
  "Erased",
  "Parasyte",
  "Another",
  "Mirai Nikki",
  "Psycho-Pass",
  "Death Parade",
  "Monster",
  "Tokyo Revengers",

  // esportes / outros
  "Haikyuu!!",
  "Haikyuu!! 2nd Season",
  "Haikyuu!! 3rd Season",
  "Haikyuu!! To the Top",
  "Kuroko no Basket",
  "Free!",
  "Yuri on Ice",

  // romance / slice of life
  "Your Name",
  "A Silent Voice",
  "Toradora!",
  "Clannad",
  "Clannad After Story",
  "Horimiya",
  "AnoHana",
  "Violet Evergarden",

  // isekai populares
  "Konosuba",
  "Konosuba 2",
  "Mushoku Tensei",
  "Dr. Stone",
  "Dr. Stone: Stone Wars",
  "The Promised Neverland",
  "The Promised Neverland 2"
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





