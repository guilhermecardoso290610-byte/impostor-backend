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
  clashroyale: ["Arqueiras (3 elixir)", "Mini P.E.K.K.A (4 elixir)", "Bola de Fogo (4 elixir)"],
  jujutsu: ["Yuji Itadori", "Satoru Gojo", "Ryomen Sukuna"],
  hexatombe: ["Cellbit", "Agatha Volkomenn", "Kerberos"],
  filmes: ["Titanic", "Jurassic Park", "Toy Story"],
  animais: ["Cachorro", "Gato", "Elefante"],
  animes: ["Naruto", "One Piece", "Jujutsu Kaisen"],
  gerais: ["Mesa", "Cadeira", "Computador"]
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
      tema: "gerais",
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

  /* ===== LISTA ===== */
  function atualizarLista(codigo) {
    const sala = salas[codigo];
    if (!sala) return;

    io.to(codigo).emit(
      "lista",
      Object.values(sala.jogadores)
    );
  }

  /* ===== JOGAR ===== */
  socket.on("jogar", ({ codigo, tema }) => {
    const sala = salas[codigo];
    if (!sala) return;
    if (socket.id !== sala.admin) return;

    sala.tema = tema;
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
    sala.palavra = escolher(temas[sala.tema]);
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

  /* ===== IMPOSTOR VER PALAVRA ===== */
  socket.on("pedirPalavra", codigo => {
    const sala = salas[codigo];
    if (!sala) return;
    if (socket.id !== sala.impostor) return;

    socket.emit("mostrarPalavraImpostor", sala.palavra);
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

      let i = 0;
      const ordem = vivos.map(j => j.id);

      const mostrarProximo = () => {
        if (i >= ordem.length) {
          setTimeout(() => iniciarVotacao(codigo), 1000);
          return;
        }
        const id = ordem[i];
        const j = sala.jogadores[id];
        const texto = sala.envios[id];

        sala.historico.push({ nome: j.nome, palavra: texto });

        io.to(codigo).emit("mostrarResposta", {
          nome: j.nome,
          palavra: texto
        });

        i++;
        setTimeout(mostrarProximo, 3000);
      };

      mostrarProximo();
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
      .forEach(j => sala.votos[j.id] = 0);

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

    let eliminado = null;
    let max = -1;
    for (const id in sala.votos) {
      if (sala.votos[id] > max) {
        max = sala.votos[id];
        eliminado = id;
      }
    }

    if (eliminado) {
      sala.jogadores[eliminado].vivo = false;
      io.to(codigo).emit("eliminado", sala.jogadores[eliminado].nome);
    }

    const vivos = Object.values(sala.jogadores).filter(j => j.vivo);
    const impostorVivo = vivos.find(j => j.id === sala.impostor);

    if (!impostorVivo || vivos.length <= 1) {
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
