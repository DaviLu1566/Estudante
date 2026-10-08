const cargos2026 = [
  { nome: "Deputado(a) Federal", digitos: 4 },
  { nome: "Deputado(a) Estadual", digitos: 5 },
  { nome: "Senador(a) - 1ª Vaga", digitos: 3 },
  { nome: "Senador(a) - 2ª Vaga", digitos: 3 },
  { nome: "Governador(a)", digitos: 2 },
  { nome: "Presidente", digitos: 2 },
];

let etapaAtual = 0;
let numeroDigitado = "";
let votoEmBranco = false;
let votacaoBloqueada = false;

const memoriaVotosEleitores = [];
let votoEleitorAtual = {};
const candidatosUnificados = [];

// BÔNUS 2: SINTETIZADOR DO SOM DA URNA
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function tocarSomPilili() {
  if (audioCtx.state === "suspended") audioCtx.resume();
  // Frequências e tempos que imitam a urna
  const notas = [
    { f: 2000, start: 0, dur: 0.08 },
    { f: 2000, start: 0.12, dur: 0.08 },
    { f: 2000, start: 0.24, dur: 0.08 },
    { f: 2000, start: 0.36, dur: 0.4 }, // Nota final longa
  ];
  notas.forEach((nota) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "square";
    osc.frequency.value = nota.f;
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime + nota.start);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + nota.start);
    osc.stop(audioCtx.currentTime + nota.start + nota.dur);
  });
}

window.onload = async () => {
  await carregarPartidos();
  iniciarNovoEleitor();
};

async function carregarPartidos() {
  try {
    const resPDC = await fetch("PDC.json");
    const dadosPDC = await resPDC.json();

    const resPDisney = await fetch("PDisney (1).json");
    const dadosPDisney = await resPDisney.json();

    dadosPDC.forEach((c) => (c.partido = "PDC"));
    dadosPDisney.forEach((c) => (c.partido = "PDisney"));

    candidatosUnificados.push(...dadosPDC, ...dadosPDisney);
  } catch (erro) {
    console.error("Erro ao integrar JSONs dos partidos:", erro);
    alert(
      "Erro ao carregar candidatos. Verifique se os arquivos PDC.json e PDisney (1).json estão corretos e se está usando Live Server.",
    );
  }
}

function iniciarNovoEleitor() {
  etapaAtual = 0;
  votoEleitorAtual = {};
  votacaoBloqueada = false;
  iniciarEtapa();
}

function iniciarEtapa() {
  numeroDigitado = "";
  votoEmBranco = false;

  const cargo = cargos2026[etapaAtual];
  document.getElementById("lblCargo").innerText = cargo.nome;
  document.getElementById("dadosCandidato").innerHTML = "";
  document.getElementById("imgCandidato").style.display = "none";
  document.getElementById("imgCandidato").src = "";

  renderizarQuadradosDigitos(cargo.digitos);
}

function renderizarQuadradosDigitos(qtd) {
  const container = document.getElementById("containerDigitos");
  container.style.display = "flex";
  container.innerHTML = "";
  for (let i = 0; i < qtd; i++) {
    const div = document.createElement("div");
    div.className = i === 0 ? "digito pisca" : "digito";
    div.id = `digito-${i}`;
    container.appendChild(div);
  }
}

function digitar(n) {
  if (votacaoBloqueada || votoEmBranco) return;

  const cargo = cargos2026[etapaAtual];
  if (numeroDigitado.length < cargo.digitos) {
    numeroDigitado += n;

    const digitoElem = document.getElementById(
      `digito-${numeroDigitado.length - 1}`,
    );
    if (digitoElem) {
      digitoElem.innerText = n;
      digitoElem.classList.remove("pisca");
    }

    if (numeroDigitado.length < cargo.digitos) {
      const proximoElem = document.getElementById(
        `digito-${numeroDigitado.length}`,
      );
      if (proximoElem) proximoElem.classList.add("pisca");
    }

    if (numeroDigitado.length === cargo.digitos) {
      verificarCandidatoDigitado(numeroDigitado, cargo.nome);
    }
  }
}

function verificarCandidatoDigitado(numero, cargoNome) {
  // Normaliza o nome do cargo (remove '1ª vaga'/'2ª vaga' para buscar no JSON)
  let cargoBusca = cargoNome.includes("Senador(a)") ? "Senador(a)" : cargoNome;

  const candidatoEncontrado = candidatosUnificados.find(
    (c) => c.numero === numero && c.cargo === cargoBusca,
  );

  if (candidatoEncontrado) {
    document.getElementById("dadosCandidato").innerHTML = `
            <strong>Nome:</strong> ${candidatoEncontrado.nome}<br>
            <strong>Partido:</strong> ${candidatoEncontrado.partido}
        `;
    document.getElementById("imgCandidato").src = candidatoEncontrado.foto;
    document.getElementById("imgCandidato").style.display = "block";
  } else {
    document.getElementById("dadosCandidato").innerHTML = `
            <div style="font-size: 1.4rem; font-weight: bold; margin-top: 10px;">VOTO NULO</div>
            <span style="font-size: 0.8rem;">Número não correspondente a nenhum candidato</span>
        `;
  }
}

function votarBranco() {
  if (votacaoBloqueada) return;
  if (numeroDigitado === "") {
    votoEmBranco = true;
    document.getElementById("containerDigitos").style.display = "none";
    document.getElementById("dadosCandidato").innerHTML = `
            <div style="font-size: 1.5rem; font-weight: bold; text-align: center; margin-top: 15px;">VOTO EM BRANCO</div>
        `;
  } else {
    alert(
      "Para votar em BRANCO, o campo não pode ter números digitados. Aperte CORRIGE primeiro.",
    );
  }
}

function corrigir() {
  if (votacaoBloqueada) return;
  iniciarEtapa();
}

function confirmar() {
  if (votacaoBloqueada) return;
  // Necessário para o AudioContext funcionar sem bloqueio do navegador
  if (audioCtx.state === "suspended") audioCtx.resume();

  const cargo = cargos2026[etapaAtual];
  let votoValidoParaRegistrar = false;
  let cargoBusca = cargo.nome.includes("Senador(a)")
    ? "Senador(a)"
    : cargo.nome;

  if (votoEmBranco) {
    votoValidoParaRegistrar = true;
    votoEleitorAtual[cargo.nome] = {
      numero: "BRANCO",
      tipo: "BRANCO",
      candidato: "VOTO EM BRANCO",
    };
  } else if (numeroDigitado.length === cargo.digitos) {
    votoValidoParaRegistrar = true;
    const candidatoEncontrado = candidatosUnificados.find(
      (c) => c.numero === numeroDigitado && c.cargo === cargoBusca,
    );

    if (candidatoEncontrado) {
      votoEleitorAtual[cargo.nome] = {
        numero: numeroDigitado,
        tipo: "REGULAR",
        candidato: candidatoEncontrado.nome,
        partido: candidatoEncontrado.partido,
      };
    } else {
      votoEleitorAtual[cargo.nome] = {
        numero: numeroDigitado,
        tipo: "NULO",
        candidato: "VOTO NULO",
      };
    }
  } else {
    alert(
      `Insira os ${cargo.digitos} dígitos do cargo de ${cargo.nome} ou vote em BRANCO.`,
    );
    return;
  }

  if (votoValidoParaRegistrar) {
    etapaAtual++;

    if (etapaAtual < cargos2026.length) {
      // Emite um beep curto para cada cargo
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.value = 1500;
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);

      iniciarEtapa();
    } else {
      finalizarVotoEleitor();
    }
  }
}

function finalizarVotoEleitor() {
  votacaoBloqueada = true;
  memoriaVotosEleitores.push(votoEleitorAtual);

  // Toca o clássico "pilili" (Bônus 2)
  tocarSomPilili();

  const tela = document.getElementById("tela");
  tela.innerHTML = `<div class="mensagem-fim">F I M</div>`;

  setTimeout(() => {
    restaurarEstruturaTela();
    iniciarNovoEleitor();
  }, 3500);
}

function restaurarEstruturaTela() {
  const tela = document.getElementById("tela");
  tela.innerHTML = `
        <div id="conteudo-voto" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
            <div class="tela-topo">
                <div>
                    <span>SEU VOTO PARA</span>
                    <div class="cargo-titulo" id="lblCargo">---</div>
                </div>
                <img id="imgCandidato" class="foto-candidato" src="" alt="" style="display: none;">
            </div>
            <div class="quadrados-numero" id="containerDigitos"></div>
            <div class="dados-candidato" id="dadosCandidato"></div>
            <div class="tela-instrucoes" id="instrucoes">
                Aperte a tecla:<br>
                <strong>VERDE</strong> para CONFIRMAR<br>
                <strong>LARANJA</strong> para CORRIGIR
            </div>
        </div>
    `;
}

// ==========================================
// BÔNUS 1: APURAÇÃO E BOLETIM DE URNA
// ==========================================
function encerrarVotacaoEEnviarTSE() {
  if (memoriaVotosEleitores.length === 0) {
    alert("Nenhum voto foi registrado nesta urna ainda!");
    return;
  }

  if (
    confirm(
      `Deseja encerrar a eleição e emitir o Boletim de Urna? (Eleitores: ${memoriaVotosEleitores.length})`,
    )
  ) {
    votacaoBloqueada = true;

    // 1. Gera e baixa o votos.json
    const payloadJson = JSON.stringify(memoriaVotosEleitores, null, 2);
    const blob = new Blob([payloadJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const linkDownload = document.createElement("a");
    linkDownload.href = url;
    linkDownload.download = `votos.json`;
    document.body.appendChild(linkDownload);
    linkDownload.click();
    document.body.removeChild(linkDownload);
    URL.revokeObjectURL(url);

    // 2. Constrói a matemática do Boletim de Urna
    const apuracao = {};

    // Inicializa contadores por cargo
    cargos2026.forEach((c) => {
      apuracao[c.nome] = { total: 0, validos: {}, nulos: 0, brancos: 0 };
    });

    // Contabiliza cada voto
    memoriaVotosEleitores.forEach((cedula) => {
      for (const [cargoNome, voto] of Object.entries(cedula)) {
        if (!apuracao[cargoNome]) continue;

        apuracao[cargoNome].total++;

        if (voto.tipo === "BRANCO") {
          apuracao[cargoNome].brancos++;
        } else if (voto.tipo === "NULO") {
          apuracao[cargoNome].nulos++;
        } else if (voto.tipo === "REGULAR") {
          const chaveCandidato = `${voto.numero} - ${voto.candidato}`;
          apuracao[cargoNome].validos[chaveCandidato] =
            (apuracao[cargoNome].validos[chaveCandidato] || 0) + 1;
        }
      }
    });

    // 3. Monta o visual do Boletim de Urna
    let htmlBoletim = `
            <div class="boletim-container">
                <div class="boletim-header">
                    <h3>JUSTIÇA ELEITORAL</h3>
                    <h2>BOLETIM DE URNA</h2>
                    <p>Total de Eleitores: ${memoriaVotosEleitores.length}</p>
                </div>
        `;

    for (const [cargoNome, dados] of Object.entries(apuracao)) {
      htmlBoletim += `<div class="boletim-cargo">${cargoNome}</div>`;

      // Renderiza candidatos válidos que receberam votos
      for (const [nome, qtd] of Object.entries(dados.validos)) {
        htmlBoletim += `<div class="boletim-linha"><span>${nome}</span> <span>${qtd} voto(s)</span></div>`;
      }

      // Renderiza Brancos e Nulos
      htmlBoletim += `<div class="boletim-linha"><span>VOTOS EM BRANCO</span> <span>${dados.brancos}</span></div>`;
      htmlBoletim += `<div class="boletim-linha"><span>VOTOS NULOS</span> <span>${dados.nulos}</span></div>`;
    }

    htmlBoletim += `
                <div class="boletim-rodape">
                    VOTAÇÃO ENCERRADA COM SUCESSO<br>
                    ARQUIVO 'votos.json' GERADO
                </div>
            </div>
        `;

    // Exibe o Boletim na tela, substituindo a interface da urna
    document.getElementById("tela").innerHTML = htmlBoletim;

    // Remove os botões de controle e o teclado numérico para impedir novas ações
    document.querySelector(".teclado").style.display = "none";
    document.querySelector(".header-controle").style.display = "none";
  }
}
