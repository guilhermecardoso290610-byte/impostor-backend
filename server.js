const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

const palavras = [
  "Abacaxi","Banana","Melancia","Morango","Laranja","Uva","Maçã","Pera",
  "Hospital","Escola","Aeroporto","Cinema","Shopping","Praia","Cemitério",
  "Delegacia","Biblioteca","Restaurante","Padaria","Supermercado",
  "Posto de gasolina","Hotel","Academia","Estádio","Igreja",
  "Celular","Computador","Televisão","Controle remoto","Teclado","Mouse",
  "Fone de ouvido","Carregador",
  "Carro","Moto","Ônibus","Caminhão","Bicicleta","Avião","Navio","Helicóptero",
  "Cachorro","Gato","Cavalo","Passarinho","Peixe","Tartaruga",
  "Cama","Sofá","Mesa","Cadeira","Geladeira","Fogão","Micro-ondas","Ventilador",
  "Relógio","Óculos","Chave","Carteira","Mochila","Guarda-chuva",
  "Futebol","Basquete","Vôlei","Tênis","Skate","Surf",
  "Brasil","Estados Unidos","Japão","França","Alemanha","Itália","Canadá",
  "Dinheiro","Cartão de crédito","Pix","Banco","Caixa eletrônico",
  "Professor","Médico","Policial","Advogado","Engenheiro","Programador","Motorista",
  "Filme","Série","Anime","Desenho","Jogo","Videogame",
  "Chuva","Sol","Neve","Vento","Tempestade",
  "Pizza","Hambúrguer","Cachorro-quente","Pastel","Lasanha","Arroz","Feijão",
  "Dinossauro","Robô","Alienígena","Fantasma","Vampiro","Zumbi",
  "Instagram","WhatsApp","YouTube","TikTok","Twitter","Discord"
];

let adminSocket = null;

io.on("connection", (socket) => {
  console.log("Entrou:", socket.id);

  socket.on("setAdmin", () => {
    adminSocket = socket.id;
    console.log("Admin definido:", socket.id);
  });

  socket.on("jogar", () => {
    if (socket.id !== adminSocket) return;

    // 🔥 SEMPRE pegar os jogadores ONLINE AGORA
    const jogadores = Array.from(io.sockets.sockets.keys());

    if (jogadores.length === 0) return;

    const palavra = palavras[Math.floor(Math.random() * palavras.length)];
    const impostor = jogadores[Math.floor(Math.random() * jogadores.length)];

    jogadores.forEach(id => {
      if (id === impostor) {
        io.to(id).emit("resultado", "IMPOSTOR");
      } else {
        io.to(id).emit("resultado", palavra);
      }
    });

    console.log(
      "Round iniciado | Jogadores:",
      jogadores.length,
      "| Palavra:",
      palavra,
      "| Impostor:",
      impostor
    );
  });

  socket.on("disconnect", () => {
    console.log("Saiu:", socket.id);
    if (socket.id === adminSocket) adminSocket = null;
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor rodando");
});
