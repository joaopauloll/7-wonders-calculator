let playerCount = 0;
let playersData = [];

function createPlayerForm(id) {
  return `
    <div class="player-block" id="player-${id}">
      <button type="button" class="btn btn-danger btn-sm remove-player-btn" onclick="removePlayer(${id})">Remover</button>
      <form onsubmit="event.preventDefault(); calcularPontuacao(${id});">
        <div class="mb-2">
          <label class="form-label">Nome</label>
          <input type="text" class="form-control" id="nome-${id}" placeholder="Jogador ${
    id + 1
  }">
        </div>
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
        <div class="mb-2">
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
        </div>
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
  playersDiv.insertAdjacentHTML("beforeend", createPlayerForm(playerCount));
  playerCount++;
  updateTabelaPontuacao();
}

function removePlayer(id) {
  const playerDiv = document.getElementById(`player-${id}`);
  if (playerDiv) playerDiv.remove();
  updateTabelaPontuacao();
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

  // Ciência
  const pedra =
    parseInt(document.getElementById(`ciencia_pedra-${id}`).value) || 0;
  const abaco =
    parseInt(document.getElementById(`ciencia_abaco-${id}`).value) || 0;
  const engrenagem =
    parseInt(document.getElementById(`ciencia_engrenagem-${id}`).value) || 0;

  const cienciaIguais = pedra * pedra + abaco * abaco + engrenagem * engrenagem;
  const conjuntos = Math.min(pedra, abaco, engrenagem);
  const cienciaConjuntos = conjuntos * 7;
  const ciencia = cienciaIguais + cienciaConjuntos;

  // Moedas: 3 moedas = 1 ponto
  const moedasPontos = Math.floor(moedas / 3);

  const total =
    militar + moedasPontos + maravilha + civis + comercial + guildas + ciencia;
  document.getElementById(`pontuacaoTotal-${id}`).textContent = total;

  updateTabelaPontuacao();
}

function getPlayersPontuacao() {
  const players = [];
  for (let i = 0; i < playerCount; i++) {
    const playerDiv = document.getElementById(`player-${i}`);
    if (!playerDiv) continue;

    const nome =
      document.getElementById(`nome-${i}`).value || `Jogador ${i + 1}`;

    // pegar valores (igual no calcularPontuacao)
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
    const ciencia = cienciaIguais + cienciaConjuntos;

    const moedasPontos = Math.floor(moedas / 3);

    const pontuacao =
      militar +
      moedasPontos +
      maravilha +
      civis +
      comercial +
      guildas +
      ciencia;

    players.push({
      nome,
      pontuacao,
      militar,
      moedas,
      moedasPontos,
      maravilha,
      civis,
      comercial,
      guildas,
      ciencia,
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

  const maxPontuacao = Math.max(...players.map((p) => p.pontuacao));
  const vencedores = players.filter((p) => p.pontuacao === maxPontuacao);

  // Tabela resumida
  let tabelaHTML = `
    <h4 class="text-center mb-3">Tabela de Pontuação</h4>
    <table class="table table-dark table-striped table-bordered text-center align-middle">
      <thead>
        <tr>
          <th>Jogador</th>
          <th>Pontuação</th>
        </tr>
      </thead>
      <tbody>
        ${players
          .map(
            (p) =>
              `<tr${
                p.pontuacao === maxPontuacao ? ' class="table-success"' : ""
              }>
            <td>${p.nome}</td>
            <td>${p.pontuacao}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;

  // Tabela detalhada
  tabelaHTML += `
    <h4 class="text-center mt-4 mb-3">Detalhamento de Pontuação</h4>
    <div id="tabelaDetalhadaWrapper">
      <table class="table table-dark table-bordered text-center align-middle">
        <thead>
          <tr>
            <th><i class="bi bi-person-fill"></i></th>
            <th class="col-civil" data-bs-toggle="tooltip" title="Civil"><i class="bi bi-building"></i></th>
            <th class="col-comercial" data-bs-toggle="tooltip" title="Comercial"><i class="bi bi-shop"></i></th>
            <th class="col-guildas" data-bs-toggle="tooltip" title="Guildas"><i class="bi bi-people"></i></th>
            <th class="col-militar" data-bs-toggle="tooltip" title="Militar"><i class="bi bi-shield-fill-exclamation"></i></th>
            <th class="col-maravilha" data-bs-toggle="tooltip" title="Maravilha"><i class="bi bi-bank"></i></th>
            <th class="col-ciencia" data-bs-toggle="tooltip" title="Ciência"><i class="bi bi-flask"></i></th>
            <th class="col-moedas" data-bs-toggle="tooltip" title="Moedas (pontos)"><i class="bi bi-coin"></i></th>
          </tr>
        </thead>
        <tbody>
          ${players
            .map(
              (p) => `
            <tr>
              <td>${p.nome}</td>
              <td class="col-civil">${p.civis}</td>
              <td class="col-comercial">${p.comercial}</td>
              <td class="col-guildas">${p.guildas}</td>
              <td class="col-militar">${p.militar}</td>
              <td class="col-maravilha">${p.maravilha}</td>
              <td class="col-ciencia">${p.ciencia}</td>
              <td class="col-moedas">${p.moedasPontos}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="text-center mt-2">
      <button id="exportImageBtn" class="btn btn-outline-light btn-sm">
        <i class="bi bi-image"></i> Exportar como Imagem
      </button>
    </div>
  `;

  tabelaDiv.innerHTML = tabelaHTML;
}

// Função para exportar a tabela detalhada como imagem
function exportarTabelaDetalhada() {
  const tabela = document.getElementById("tabelaDetalhadaWrapper");
  if (!tabela) return;

  html2canvas(tabela, { backgroundColor: "#23272b" }).then((canvas) => {
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

// Atualiza a tabela ao adicionar/remover jogadores
document.getElementById("addPlayerBtn").addEventListener("click", addPlayer);

// Adiciona o primeiro jogador automaticamente ao abrir a página
window.onload = addPlayer;
