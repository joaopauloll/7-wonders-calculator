let playerCount = 0;
let idCount = 0;
let playersData = [];
let rodadaParaRemover = null;
let gameMode = "7wonders"; // padrão
let lideresAtivo = false;

const expansoesCheckbox = document.getElementById("expansoes");
const expansoesOpcoes = document.getElementById("expansoesOpcoes");
const lideresCheckbox = document.getElementById("lideresExpansao");

atualizarHistoricoParaGameMode();

document.querySelectorAll("input[name='gameMode']").forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const newMode = e.target.value;

    if (!confirmarAlteracaoModoJogo()) {
      return;
    }

    // Limpa os players e reseta contador
    document.getElementById("players").innerHTML = "";
    playerCount = 0;
    idCount = 0;
    gameMode = newMode;

    // Adiciona um player vazio inicial
    if (gameMode === "7wonders") {
      addPlayer();
      document.getElementById("addPlayerBtn").classList.remove("d-none");
      document
        .getElementById("tdNomeJogador")
        .classList.remove("nome-jogador-7wd");
      document.getElementById("tdNomeJogador").classList.add("nome-jogador-7w");
      expansoesCheckbox.disabled = false;
    } else if (gameMode === "7wondersDuel") {
      addPlayer();
      addPlayer();
      document.getElementById("addPlayerBtn").classList.add("d-none");
      document.getElementById("removePlayerBtn(1)").classList.add("d-none");
      document
        .getElementById("tdNomeJogador")
        .classList.remove("nome-jogador-7w");
      document
        .getElementById("tdNomeJogador")
        .classList.add("nome-jogador-7wd");

      expansoesOpcoes.classList.add("d-none");
      expansoesCheckbox.checked = false;
      expansoesCheckbox.disabled = true;
      lideresAtivo = false;
      lideresCheckbox.checked = false;
      updateTabelaPontuacao();
    }
  });
});

function createPlayerForm(id) {
  const scienceField =
    gameMode === "7wonders"
      ? `
      <div class="mb-3">
        <label class="form-label">Ciência</label>
        <div class="row">
          <div class="col-4">
            <label class="form-label small">Tablets</label>
            <input type="number" class="form-control" id="ciencia_pedra-${id}" min="0" />
          </div>
          <div class="col-4">
            <label class="form-label small">Compassos</label>
            <input type="number" class="form-control" id="ciencia_abaco-${id}" min="0" />
          </div>
          <div class="col-4">
            <label class="form-label small">Engrenagens</label>
            <input type="number" class="form-control" id="ciencia_engrenagem-${id}" min="0" />
          </div>
        </div>
      </div>`
      : `
      <div class="row mb-3">
        <div class="col-6">
          <label class="form-label">Ciência</label>
          <input type="number" class="form-control" id="ciencia-${id}" min="0" />
        </div>
        <div class="col-6">
          <label class="form-label">Progresso</label>
          <input type="number" class="form-control" id="progresso-${id}" min="0" />
        </div>
      </div>`;
  const firstLine =
    lideresAtivo && gameMode === "7wonders"
      ? `
      <div class="row mb-2">
          <div class="col-6">
            <label class="form-label">Nome</label>
            <input type="text" class="form-control" id="nome-${id}" placeholder="Jogador ${
          id + 1
        }">
          </div>
          <div class="col-6">
            <label class="form-label">Líderes</label>
            <input type="number" class="form-control" id="lideres-${id}">
          </div>
        </div>`
      : `
      <div class="mb-2">
          <label class="form-label">Nome</label>
          <input type="text" class="form-control" id="nome-${id}" placeholder="Jogador ${
          id + 1
        }">
        </div>`;
  return `
    <div class="player-block" id="player-${id}">
      <button type="button" class="btn btn-danger btn-sm remove-player-btn" id="removePlayerBtn(${id})" onclick="removePlayer(${id})"><i class="bi bi-x-lg"></i></button>
      <form onsubmit="event.preventDefault(); calcularPontuacao(${id});">
        ${firstLine}
        <div class="row mb-2">
          <div class="col-6">
            <label class="form-label">Civil</label>
            <input type="number" class="form-control" id="civis-${id}" />
          </div>
          <div class="col-6">
            <label class="form-label">Comercial</label>
            <input type="number" class="form-control" id="comercial-${id}" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-6">
            <label class="form-label">Guildas</label>
            <input type="number" class="form-control" id="guildas-${id}" />
          </div>
          <div class="col-6">
            <label class="form-label">Militar</label>
            <input type="number" class="form-control" id="militar-${id}" />
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-6">
            <label class="form-label">Maravilha</label>
            <input type="number" class="form-control" id="maravilha-${id}" />
          </div>
          <div class="col-6">
            <label class="form-label">Moedas</label>
            <input type="number" class="form-control" id="moedas-${id}" />
          </div>
        </div>
        ${scienceField}
        <button type="submit" class="btn btn-primary w-100">Calcular</button>
      </form>
      <div class="mt-2 text-center">
        <h3>Pontuação: <span id="pontuacaoTotal-${id}">0</span></h3>
      </div>
    </div>
  `;
}

function addPlayer() {
  const playersDiv = document.getElementById("players");
  playersDiv.insertAdjacentHTML("beforeend", createPlayerForm(idCount));
  playerCount++;
  idCount++;
  updateTabelaPontuacao();
  document.getElementById("removePlayerBtn(0)").classList.add("d-none");
  if (playerCount === 7) {
    document.getElementById("addPlayerBtn").classList.add("d-none");
  }
}

function removePlayer(id) {
  const playerDiv = document.getElementById(`player-${id}`);
  if (playerDiv) playerDiv.remove();
  playerCount--;
  updateTabelaPontuacao();
  document.getElementById("addPlayerBtn").classList.remove("d-none");
}

function calcularPontuacao(id) {
  const militar = parseInt(document.getElementById(`militar-${id}`).value) || 0;
  const moedas = parseInt(document.getElementById(`moedas-${id}`).value) || 0;
  const maravilha =
    parseInt(document.getElementById(`maravilha-${id}`).value) || 0;
  const civis = parseInt(document.getElementById(`civis-${id}`).value) || 0;
  const comercial =
    parseInt(document.getElementById(`comercial-${id}`).value) || 0;
  const guildas = parseInt(document.getElementById(`guildas-${id}`).value) || 0;

  let lideres = 0;
  let ciencia = 0;
  let progresso = 0;

  if (gameMode === "7wonders") {
    // Pontos de líderes se a expansão estiver ativa
    if (lideresAtivo) {
      lideres = parseInt(document.getElementById(`lideres-${id}`).value) || 0;
    }

    // Ciência padrão 7 Wonders
    const pedra =
      parseInt(document.getElementById(`ciencia_pedra-${id}`).value) || 0;
    const abaco =
      parseInt(document.getElementById(`ciencia_abaco-${id}`).value) || 0;
    const engrenagem =
      parseInt(document.getElementById(`ciencia_engrenagem-${id}`).value) || 0;

    const cienciaIguais =
      pedra * pedra + abaco * abaco + engrenagem * engrenagem;
    const conjuntos = Math.min(pedra, abaco, engrenagem);
    const cienciaConjuntos = conjuntos * 7;
    ciencia = cienciaIguais + cienciaConjuntos;
  } else if (gameMode === "7wondersDuel") {
    // Ciência direta em 7 Wonders Duel
    ciencia = parseInt(document.getElementById(`ciencia-${id}`).value) || 0;
    progresso = parseInt(document.getElementById(`progresso-${id}`).value) || 0;
  }

  const total =
    militar +
    moedas +
    maravilha +
    civis +
    comercial +
    guildas +
    ciencia +
    progresso +
    lideres;
  document.getElementById(`pontuacaoTotal-${id}`).textContent = total;

  updateTabelaPontuacao();
}

function getPlayersPontuacao() {
  const players = [];
  for (let i = 0; i < idCount; i++) {
    const playerDiv = document.getElementById(`player-${i}`);
    if (!playerDiv) continue;

    const nome =
      document.getElementById(`nome-${i}`).value || `Jogador ${i + 1}`;

    const militar =
      parseInt(document.getElementById(`militar-${i}`).value) || 0;
    const moedas = parseInt(document.getElementById(`moedas-${i}`).value) || 0;
    const maravilha =
      parseInt(document.getElementById(`maravilha-${i}`).value) || 0;
    const civis = parseInt(document.getElementById(`civis-${i}`).value) || 0;
    const comercial =
      parseInt(document.getElementById(`comercial-${i}`).value) || 0;
    const guildas =
      parseInt(document.getElementById(`guildas-${i}`).value) || 0;

    let lideres = 0;
    let ciencia = 0;
    let progresso = 0;

    if (gameMode === "7wonders") {
      if (lideresAtivo) {
        lideres = parseInt(document.getElementById(`lideres-${i}`).value) || 0;
      }

      const pedra =
        parseInt(document.getElementById(`ciencia_pedra-${i}`).value) || 0;
      const abaco =
        parseInt(document.getElementById(`ciencia_abaco-${i}`).value) || 0;
      const engrenagem =
        parseInt(document.getElementById(`ciencia_engrenagem-${i}`).value) || 0;

      const cienciaIguais =
        pedra * pedra + abaco * abaco + engrenagem * engrenagem;
      const conjuntos = Math.min(pedra, abaco, engrenagem);
      const cienciaConjuntos = conjuntos * 7;
      ciencia = cienciaIguais + cienciaConjuntos;
    } else if (gameMode === "7wondersDuel") {
      ciencia = parseInt(document.getElementById(`ciencia-${i}`).value) || 0;
      progresso =
        parseInt(document.getElementById(`progresso-${i}`).value) || 0;
    }

    const pontuacao =
      militar +
      moedas +
      maravilha +
      civis +
      comercial +
      guildas +
      ciencia +
      progresso +
      lideres;

    players.push({
      nome,
      pontuacao,
      militar,
      moedas,
      maravilha,
      civis,
      comercial,
      guildas,
      ciencia,
      progresso,
      lideres,
    });
  }
  return players;
}

function updateTabelaPontuacao() {
  let tabelaDiv = document.getElementById("tabelaPontuacao");
  if (!tabelaDiv) {
    tabelaDiv = document.createElement("div");
    tabelaDiv.id = "tabelaPontuacao";
    tabelaDiv.className = "mt-4";
    document.querySelector(".form-container").appendChild(tabelaDiv);
  }

  const players = getPlayersPontuacao();
  if (players.length === 0) {
    tabelaDiv.innerHTML = "";
    return;
  }
  players.sort((a, b) => b.pontuacao - a.pontuacao);

  const maxPontuacao = Math.max(...players.map((p) => p.pontuacao));
  const vencedores = players.filter((p) => p.pontuacao === maxPontuacao);

  let tabelaHTML = `
    <h4 class="text-center mt-4 mb-3">Tabela de Pontuação</h4>
    <div class="tabela-detalhada-container">
      <table class="table table-dark table-bordered text-center align-middle tabela-detalhada">
        <thead>
          <tr>
            <th id="thNomeJogador" class="nome-jogador-7w"><i class="bi bi-person-fill"></i></th>
            ${
              lideresAtivo
                ? `<th class="col-lideres" data-bs-toggle="tooltip" title="Líderes"><i class="bi bi-person-badge"></i></th>`
                : ""
            }
            <th class="col-civil" data-bs-toggle="tooltip" title="Civil"><i class="bi bi-building"></i></th>
            <th class="col-comercial" data-bs-toggle="tooltip" title="Comercial"><i class="bi bi-shop"></i></th>
            <th class="col-guildas" data-bs-toggle="tooltip" title="Guildas"><i class="bi bi-people"></i></th>
            <th class="col-militar" data-bs-toggle="tooltip" title="Militar"><i class="bi bi-shield-exclamation"></i></th>
            <th class="col-maravilha" data-bs-toggle="tooltip" title="Maravilha"><i class="bi bi-bank"></i></th>
            <th class="col-ciencia" data-bs-toggle="tooltip" title="Ciência"><i class="bi bi-flask"></i></th>
            ${
              gameMode === "7wondersDuel"
                ? `<th class="col-progresso" data-bs-toggle="tooltip" title="Progresso"><i class="bi bi-bar-chart-line-fill"></i></th>`
                : ""
            }
            <th class="col-moedas" data-bs-toggle="tooltip" title="Moedas (pontos)"><i class="bi bi-coin"></i></th>
            <th class="col-pontuacao"><i class="bi bi-trophy-fill"></i></th>
          </tr>
        </thead>
        <tbody>
          ${players
            .map(
              (p) => `
            <tr>
              <td id="tdNomeJogador" class="nome-jogador-7w">${p.nome}</td>
              ${lideresAtivo ? `<td class="col-lideres">${p.lideres}</td>` : ""}
              <td class="col-civil">${p.civis}</td>
              <td class="col-comercial">${p.comercial}</td>
              <td class="col-guildas">${p.guildas}</td>
              <td class="col-militar">${p.militar}</td>
              <td class="col-maravilha">${p.maravilha}</td>
              <td class="col-ciencia">${p.ciencia}</td>
              ${
                gameMode === "7wondersDuel"
                  ? `<td class="col-progresso">${p.progresso}</td>`
                  : ""
              }
              <td class="col-moedas">${p.moedas}</td>
              <td class="col-pontuacao fw-bold">${p.pontuacao}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="text-center mt-4">
      <button id="exportImageBtn" class="btn btn-outline-light btn-sm">
        <i class="bi bi-image"></i> Exportar como Imagem
      </button>
    </div>
    <div class="d-flex gap-2 mb-3 mt-4">
    <button id="showHistory" class="btn btn-info flex-grow-1" data-bs-toggle="modal" data-bs-target="#historyModal">Histórico</button>
      <button id="saveResults" class="btn btn-warning flex-grow-1">Salvar Partida</button>
    </div>
  `;

  tabelaDiv.innerHTML = tabelaHTML;
}

// Função para exportar a tabela detalhada como imagem
function exportarTabelaDetalhada() {
  const container = document.querySelector(".tabela-detalhada-container");
  if (!container) return;

  html2canvas(container.querySelector("table"), {
    backgroundColor: "#23272b",
  }).then((canvas) => {
    const link = document.createElement("a");
    link.download = "tabela_detalhada.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

// Delegar evento para o botão (pois a tabela é recriada dinamicamente)
document.addEventListener("click", function (e) {
  if (e.target.closest("#exportImageBtn")) {
    exportarTabelaDetalhada();
  }
});

// Função para salvar resultados atuais no LocalStorage
function salvarResultados() {
  const players = getPlayersPontuacao(); // array com {nome, pontuacao}
  if (players.length === 0) return;

  const expansoes = [];
  if (lideresAtivo) expansoes.push("Líderes");

  // Recupera histórico atual
  const historico =
    JSON.parse(localStorage.getItem("resultados7Wonders")) || [];

  // Adiciona resultado atual com data
  historico.push({
    date: new Date().toLocaleString(),
    gameMode: gameMode,
    expansoes: expansoes,
    players: players,
  });

  // Salva de volta
  localStorage.setItem("resultados7Wonders", JSON.stringify(historico));

  const modal = new bootstrap.Modal(
    document.getElementById("saveSuccessModal")
  );
  modal.show();
}

// Função para carregar histórico e exibir no modal
function mostrarHistorico() {
  const filtro = document.querySelector(
    "input[name='filtroJogo']:checked"
  ).value;
  const historico =
    JSON.parse(localStorage.getItem("resultados7Wonders")) || [];
  const container = document.getElementById("historyEntries");

  const filtrado = historico.filter(
    (entry) => filtro === "all" || entry.gameMode === filtro
  );

  if (filtrado.length === 0) {
    container.innerHTML = "<p>Nenhuma partida salva ainda.</p>";
    return;
  }

  // Monta HTML do histórico
  let html = filtrado
    .map((entry, index) => {
      const rows = entry.players
        .sort((a, b) => b.pontuacao - a.pontuacao)
        .map((p) => `<tr><td>${p.nome}</td><td>${p.pontuacao}</td></tr>`)
        .join("");

      const modoJogo =
        entry.gameMode === "7wondersDuel"
          ? "7 Wonders Duel"
          : entry.expansoes && entry.expansoes.length > 0
          ? `7 Wonders + ${entry.expansoes.join(", ")}`
          : "7 Wonders";

      return `
      <div class="history-entry mb-4 border border-secondary rounded p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0">${modoJogo} - ${entry.date}</h6>
          <button class="btn btn-sm btn-danger" onclick="confirmarRemocao(${index})">Remover</button>
        </div>
        <table class="table table-dark table-striped text-center mb-0">
          <thead>
            <tr><th>Jogador</th><th>Pontuação</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
    })
    .join("");

  container.innerHTML = html;
}

function confirmarRemocao(index) {
  rodadaParaRemover = index;
  const modal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  modal.show();
}

function atualizarHistoricoParaGameMode() {
  const historico =
    JSON.parse(localStorage.getItem("resultados7Wonders")) || [];
  let alterado = false;

  historico.forEach((entry) => {
    if (!entry.hasOwnProperty("gameMode")) {
      entry.gameMode = "7wonders"; // adiciona o gameMode padrão
      alterado = true;
    }
  });

  if (alterado) {
    localStorage.setItem("resultados7Wonders", JSON.stringify(historico));
    console.log(
      "Histórico atualizado com gameMode padrão para partidas antigas."
    );
  }
}

function confirmarAlteracaoModoJogo() {
  // Verifica se algum campo dos jogadores está preenchido
  let algumPreenchido = false;
  for (let i = 0; i < playerCount; i++) {
    const playerDiv = document.getElementById(`player-${i}`);
    if (!playerDiv) continue;
    const inputs = playerDiv.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.value) algumPreenchido = true;
    });
    if (algumPreenchido) break;
  }

  // Se tiver algum preenchido, pergunta antes de mudar
  if (algumPreenchido) {
    if (
      !confirm(
        "Você tem certeza de que deseja mudar o modo de jogo? Isso irá redefinir todos os jogadores e suas pontuações."
      )
    ) {
      // Reverte o radio para o anterior
      document.querySelector(`input[value='${gameMode}']`).checked = true;
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

expansoesCheckbox.addEventListener("change", () => {
  if (expansoesCheckbox.checked && gameMode === "7wonders") {
    expansoesOpcoes.classList.remove("d-none");
  } else {
    expansoesOpcoes.classList.add("d-none");

    if (lideresCheckbox.checked) {
      if (!confirmarAlteracaoModoJogo()) {
        expansoesCheckbox.checked = !expansoesCheckbox.checked;
        expansoesOpcoes.classList.remove("d-none");
        return;
      }
      lideresCheckbox.checked = false;
      lideresAtivo = false;
      limparFormulario();
      updateTabelaPontuacao();
    }
  }
});

lideresCheckbox.addEventListener("change", () => {
  if (!confirmarAlteracaoModoJogo()) {
    // Mantem o estado anterior do checkbox
    lideresCheckbox.checked = !lideresCheckbox.checked;
    return;
  }
  if (lideresCheckbox.checked) {
    lideresAtivo = true;
  } else {
    lideresAtivo = false;
  }
  limparFormulario();
  updateTabelaPontuacao();
});

function limparFormulario() {
  document.getElementById("players").innerHTML = "";
  playerCount = 0;
  idCount = 0;
  addPlayer();
}

// Evento para confirmar remoção
document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", function () {
    if (rodadaParaRemover !== null) {
      const historico =
        JSON.parse(localStorage.getItem("resultados7Wonders")) || [];
      historico.splice(rodadaParaRemover, 1);
      localStorage.setItem("resultados7Wonders", JSON.stringify(historico));
      mostrarHistorico();
      rodadaParaRemover = null;
      bootstrap.Modal.getInstance(
        document.getElementById("confirmDeleteModal")
      ).hide();
    }
  });

// Eventos para salvar resultados e mostrar histórico
document.addEventListener("click", function (e) {
  if (e.target.closest("#saveResults")) {
    salvarResultados();
  }
});
document.addEventListener("click", function (e) {
  if (e.target.closest("#showHistory")) {
    mostrarHistorico();
  }
});

// Eventos para filtros do histórico
document.getElementById("filtroTodos").addEventListener("change", (e) => {
  mostrarHistorico();
});
document.getElementById("filtro7W").addEventListener("change", (e) => {
  mostrarHistorico();
});
document.getElementById("filtro7WDuel").addEventListener("change", (e) => {
  mostrarHistorico();
});

// Atualiza a tabela ao adicionar/remover jogadores
document.getElementById("addPlayerBtn").addEventListener("click", addPlayer);

// Adiciona o primeiro jogador automaticamente ao abrir a página
window.onload = addPlayer;
