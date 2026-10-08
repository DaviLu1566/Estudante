// Partido do aluno
const PARTIDO = "PDC";
const NUMERO_PARTIDO = "93";

// Array que armazenará os candidatos carregados
const candidatos = [];
 // Carrega os candidatos do partido PDC
async function carregarCandidatos() {
  try {
    const resposta = await fetch("candidatos.json");

    if (!resposta.ok) {
      throw new Error("Erro ao carregar candidatos.json");
    }

    const dados = await resposta.json();

    candidatos.length = 0;

    dados[PARTIDO].forEach((candidato) => {
      candidatos.push({
        nome: candidato.nome,
        foto: candidato.foto,
        cargo: "",
        numero: "",
      });
    });

    console.log("Candidatos carregados:", candidatos);
  } catch (erro) {
    console.error(erro);
  }
}

/*
 * Validação da numeração eleitoral
 * Presidente       -> 93
 * Governador(a)    -> 93
 * Senador(a)       -> 93X
 * Dep. Federal     -> 93XX
 * Dep. Estadual    -> 93XXX
 */
function validarNumeroCandidato(numero, cargo) {
  if (!numero.startsWith(NUMERO_PARTIDO)) {
    return false;
  }

  switch (cargo) {
    case "Presidente":
    case "Governador(a)":
      return numero.length === 2;

    case "Senador(a)":
      return numero.length === 3;

    case "Deputado(a) Federal":
      return numero.length === 4;

    case "Deputado(a) Estadual":
      return numero.length === 5;

    default:
      return false;
  }
}


  //Verifica quantidade máxima permitida por cargo

function validarLimiteCargo(registroCandidaturas, cargo) {
  const quantidade = registroCandidaturas.filter(
    (candidato) => candidato.cargo === cargo,
  ).length;

  switch (cargo) {
    case "Presidente":
      return quantidade < 1;

    case "Governador(a)":
      return quantidade < 1;

    case "Senador(a)":
      return quantidade < 2;

    case "Deputado(a) Federal":
      return true;

    case "Deputado(a) Estadual":
      return true;
      
    default:
      return false;
  }
}


  //Verifica se o candidato já foi registrado
 
function candidatoJaRegistrado(registroCandidaturas, nome) {
  return registroCandidaturas.some((candidato) => candidato.nome === nome);
}


  //Gera arquivo JSON para download
 
function exportarJSON(registroCandidaturas) {
  const json = JSON.stringify(registroCandidaturas, null, 2);

  const blob = new Blob([json], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "PDC.json";
  link.click();
}
