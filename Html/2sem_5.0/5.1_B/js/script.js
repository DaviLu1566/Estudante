
// Arrays para armazenar os produtos.

const nomes = ["Maçã", "Banana", "Tomate", "Alface"];

const categorias = [
    "Fruta",
    "Fruta",
    "Legume",
    "Verdura"
];

const precos = [5.99, 4.50, 6.00, 3.50];

const quantidades = [30, 50, 25, 40];

// Elementos da página.

const selectProdutos = document.getElementById("selectProdutos");

const divNome = document.getElementById("divNome");
const divCategoria = document.getElementById("divCategoria");
const divPreco = document.getElementById("divPreco");
const divQuantidade = document.getElementById("divQuantidade");

const modalForm = document.getElementById("modalForm");

// Atualiza a lista de produtos.

function atualizarLista() {

    selectProdutos.innerHTML = "";

    nomes.forEach(function(nome, index) {

        const opcao = document.createElement("option");

        opcao.value = index;
        opcao.textContent = nome;

        selectProdutos.appendChild(opcao);

    });

}

// Mostra os detalhes do produto selecionado.

document.getElementById("btnDetalhes").addEventListener("click", function() {

    const index = selectProdutos.value;

    if (index === "" || !nomes[index]) {
        alert("Selecione um produto!");
        return;
    }

    divNome.textContent = nomes[index];

    divCategoria.textContent = categorias[index];

    divPreco.textContent =
        "R$ " + precos[index].toFixed(2);

    divQuantidade.textContent =
        quantidades[index] + " unidades";

});

// Abre o formulário.

document.getElementById("btnNovo").addEventListener("click", function() {

    modalForm.style.display = "flex";

});

// Cancela o cadastro.

document.getElementById("btnCancelar").addEventListener("click", function() {

    modalForm.style.display = "none";

    limparFormulario();

});

// Salva o novo produto.

document.getElementById("btnSalvar").addEventListener("click", function() {

    const nome = document.getElementById("inputNome").value.trim();

    const categoria = document.getElementById("inputCategoria").value.trim();

    const precoCampo = document.getElementById("inputPreco").value;

    const quantidadeCampo = document.getElementById("inputQuantidade").value;

    const preco = Number(precoCampo);

    const quantidade = Number(quantidadeCampo);

    if (!nome || !categoria || precoCampo === "" || quantidadeCampo === "") {
        alert("Preencha todos os campos!");
        return;
    }

    if (!Number.isFinite(preco) || preco < 0 ||
        !Number.isInteger(quantidade) || quantidade < 0) {
        alert("Informe um preço e uma quantidade válidos!");
        return;
    }

    nomes.push(nome);
    categorias.push(categoria);
    precos.push(preco);
    quantidades.push(quantidade);

    atualizarLista();

    selectProdutos.value = nomes.length - 1;

    modalForm.style.display = "none";

    limparFormulario();

    alert("Produto cadastrado com sucesso!");

});

// Limpa os campos do formulário.

function limparFormulario() {

    document.getElementById("inputNome").value = "";
    document.getElementById("inputCategoria").value = "";
    document.getElementById("inputPreco").value = "";
    document.getElementById("inputQuantidade").value = "";

}

// Inicializa a lista.

atualizarLista();
