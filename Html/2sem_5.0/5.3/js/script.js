
// Lista que receberá os objetos do arquivo JSON.

let produtos = [];

// Elementos da página.

const selectProdutos = document.getElementById("selectProdutos");

const divNome = document.getElementById("divNome");
const divCategoria = document.getElementById("divCategoria");
const divPreco = document.getElementById("divPreco");
const divQuantidade = document.getElementById("divQuantidade");

const modalForm = document.getElementById("modalForm");

// Carrega os dados do arquivo JSON.

async function carregarProdutos() {

    try {

        const resposta = await fetch("produtos.json");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar produtos.json");
        }

        const dados = await resposta.json();

        produtos = dados;

        atualizarLista();

    } catch (erro) {

        console.error("Erro:", erro);

        alert("Não foi possível carregar o JSON. Utilize o Live Server.");

    }

}

// Atualiza a lista de produtos.

function atualizarLista() {

    selectProdutos.innerHTML = "";

    produtos.forEach(function(produto, index) {

        const opcao = document.createElement("option");

        opcao.value = index;
        opcao.textContent = produto.nome;

        selectProdutos.appendChild(opcao);

    });

}

// Mostra os detalhes do produto.

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

// Abre o formulário.

document.getElementById("btnNovo").addEventListener("click", function() {

    modalForm.style.display = "flex";

});

// Cancela o cadastro.

document.getElementById("btnCancelar").addEventListener("click", function() {

    modalForm.style.display = "none";

    limparFormulario();

});

// Cadastra um produto.

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

    const novoProduto = {

        id: Date.now(),
        nome: nome,
        categoria: categoria,
        preco: preco,
        quantidade: quantidade

    };

    produtos.push(novoProduto);

    atualizarLista();

    selectProdutos.value = produtos.length - 1;

    modalForm.style.display = "none";

    limparFormulario();

    alert("Produto cadastrado! Clique em Exportar JSON para salvar os dados.");

});

// Exporta os produtos atualizados para um arquivo JSON.

function exportarJSON() {

    const conteudo = JSON.stringify(produtos, null, 4);

    const arquivo = new Blob(
        [conteudo],
        { type: "application/json" }
    );

    const endereco = URL.createObjectURL(arquivo);

    const link = document.createElement("a");

    link.href = endereco;
    link.download = "produtos.json";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(endereco);

}

// Limpa os campos.

function limparFormulario() {

    document.getElementById("inputNome").value = "";
    document.getElementById("inputCategoria").value = "";
    document.getElementById("inputPreco").value = "";
    document.getElementById("inputQuantidade").value = "";

}

// Cria o botão de exportação.

const btnExportar = document.createElement("button");

btnExportar.textContent = "Exportar JSON";

btnExportar.addEventListener("click", exportarJSON);

document.querySelector(".painel-meio").appendChild(btnExportar);

// Inicialização.

carregarProdutos();
