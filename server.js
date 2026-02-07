const express = require("express");
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


const salas = {}; // codigoSala -> { jogadores: [], admin }


function gerarCodigo() {
return Math.random().toString(36).substring(2, 7).toUpperCase();
}


io.on("connection", (socket) => {


socket.on("criarSala", ({ nome, user, pass }) => {
if (user !== "wxguix" || pass !== "wxguix") return;


const codigo = gerarCodigo();
salas[codigo] = {
admin: socket.id,
jogadores: [{ id: socket.id, nome }]
};


socket.join(codigo);
socket.emit("salaCriada", codigo);
io.to(codigo).emit("lista", salas[codigo].jogadores);
});


socket.on("entrarSala", ({ codigo, nome }) => {
if (!salas[codigo]) return;


salas[codigo].jogadores.push({ id: socket.id, nome });
socket.join(codigo);


io.to(codigo).emit("lista", salas[codigo].jogadores);
});


socket.on("jogar", (codigo) => {
const sala = salas[codigo];
if (!sala) return;
if (socket.id !== sala.admin) return;


const jogadores = sala.jogadores;
if (jogadores.length === 0) return;


const palavra = palavras[Math.floor(Math.random() * palavras.length)];
const impostor = jogadores[Math.floor(Math.random() * jogadores.length)];


jogadores.forEach(j => {
if (j.id === impostor.id) {
io.to(j.id).emit("resultado", "IMPOSTOR");
} else {
io.to(j.id).emit("resultado", palavra);
}
});
});


socket.on("disconnect", () => {
for (const codigo in salas) {
salas[codigo].jogadores = salas[codigo].jogadores.filter(j => j.id !== socket.id);
if (salas[codigo].jogadores.length === 0) delete salas[codigo];
else io.to(codigo).emit("lista", salas[codigo].jogadores);
}
});
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor rodando"));
