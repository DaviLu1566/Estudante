
// Classe responsável por criar os produtos.

class Produto {

    constructor(id, nome, categoria, preco, quantidade) {

        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.preco = preco;
        this.quantidade = quantidade;

    }

}

// Lista de objetos em memória.

let produtos = [

    new Produto(1, "Maçã", "Fruta", 5.99, 30),

    new Produto(2, "Banana", "Fruta", 4.50, 50),

    new Produto(3, "Tomate", "Legume", 6.00, 25),

    new Produto(4, "Alface", "Verdura", 3.50, 40)

];

// Elementos da página.

const selectProdutos = document.getElementById("selectProdutos");

const divNome = document.getElementById("divNome");
const divCategoria = document.getElementById("divCategoria");
const divPreco = document.getElementById("divPreco");
const divQuantidade = document.getElementById("divQuantidade");

const modalForm = document.getElementById("modalForm");

// Atualiza a lista de produtos na tela.

function atualizarLista() {

    selectProdutos.innerHTML = "";

    produtos.forEach(function(produto, index) {

        const opcao = document.createElement("option");

        opcao.value = index;
        opcao.textContent = produto.nome;

        selectProdutos.appendChild(opcao);

    });

}

// Exibe os detalhes do produto.

document.getElementById("btnDetalhes").addEventListener("click", function() {

    const index = Number(selectProdutos.value);

    const produto = produtos[index];

    if (!produto) {
        alert("Selecione um produto!");
        return;
    }

    divNome.textContent = produto.nome;

    divCategoria.textContent = produto.categoria;

    divPreco.textContent =
        "R$ " + produto.preco.toFixed(2);

    divQuantidade.textContent =
        produto.quantidade + " unidades";

});

// Abre o modal.

document.getElementById("btnNovo").addEventListener("click", function() {

    modalForm.style.display = "flex";

});

// Cancela o cadastro.

document.getElementById("btnCancelar").addEventListener("click", function() {

    modalForm.style.display = "none";

    limparFormulario();

});

// Cadastra um novo objeto Produto.

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
        alert("Preço ou quantidade inválidos!");
        return;
    }

    // Cria um novo objeto.

    const novoProduto = new Produto(
        Date.now(),
        nome,
        categoria,
        preco,
        quantidade
    );

    // Adiciona o objeto à lista.

    produtos.push(novoProduto);

    atualizarLista();

    selectProdutos.value = produtos.length - 1;

    modalForm.style.display = "none";

    limparFormulario();

    alert("Produto cadastrado com sucesso!");

});

// Limpa o formulário.

function limparFormulario() {

    document.getElementById("inputNome").value = "";
    document.getElementById("inputCategoria").value = "";
    document.getElementById("inputPreco").value = "";
    document.getElementById("inputQuantidade").value = "";

}

// Inicialização.

atualizarLista();
