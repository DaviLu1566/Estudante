
// Arrays com os dados dos estados da região Sul.

const siglas = ["PR", "SC", "RS"];

const capitais = [
    "Curitiba",
    "Florianópolis",
    "Porto Alegre"
];

const areas = [
    "199.298,981 km²",
    "95.730,690 km²",
    "281.707,151 km²"
];

const populacoes = [
    "11.444.380 habitantes",
    "7.610.361 habitantes",
    "10.882.965 habitantes"
];

const bandeiras = [
    "https://upload.wikimedia.org/wikipedia/commons/9/93/Bandeira_do_Paran%C3%A1.svg",
    "https://upload.wikimedia.org/wikipedia/commons/1/1a/Bandeira_de_Santa_Catarina.svg",
    "https://upload.wikimedia.org/wikipedia/commons/6/63/Bandeira_do_Rio_Grande_do_Sul.svg"
];

// Mapeamento dos elementos HTML.

const selectEstados = document.getElementById("selectEstados");
const btnDetalhes = document.getElementById("btnDetalhes");

const divCapital = document.getElementById("divCapital");
const divArea = document.getElementById("divArea");
const divPopulacao = document.getElementById("divPopulacao");
const divBandeira = document.getElementById("divBandeira");

// Evento do botão Detalhes.

btnDetalhes.addEventListener("click", function() {

    const index = Number(selectEstados.value);

    if (index >= 0 && index < siglas.length) {

        divCapital.textContent = capitais[index];

        divArea.textContent = areas[index];

        divPopulacao.textContent = populacoes[index];

        divBandeira.innerHTML =
            `<img src="${bandeiras[index]}" alt="Bandeira do ${siglas[index]}">`;

    }

});
