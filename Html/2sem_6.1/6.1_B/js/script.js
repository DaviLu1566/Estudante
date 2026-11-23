
let produtosData = [];

// Carrega os produtos do arquivo JSON.
async function carregarEstoque() {

    try {

        const response = await fetch("estoque.json");

        if (!response.ok) {
            throw new Error("Erro ao carregar estoque.json");
        }

        produtosData = await response.json();

        renderizarCards();

    } catch (error) {

        console.error("Erro:", error);

        alert("Não foi possível carregar o estoque. Utilize o Live Server.");

    }
}

// Exibe os produtos na tela.
function renderizarCards() {

    const container = document.getElementById("gridProdutos");

    container.innerHTML = "";

    produtosData.forEach(produto => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <img src="${produto.foto}" alt="${produto.nome}">

            <div class="card-body">

                <span class="badge-unidade">
                    ${produto.unidade}
                </span>

                <h3 class="card-title">
                    ${produto.nome}
                </h3>

                <div class="card-info">
                    <strong>Preço de Compra:</strong>
                    R$ ${produto.precoCompra.toFixed(2)}
                </div>

                <div class="card-info">
                    <strong>Preço de Venda:</strong>
                    R$ ${produto.precoVenda.toFixed(2)}
                </div>

                <div class="card-info">
                    <strong>Estoque Atual:</strong>
                    ${produto.quantidadeEstoque}
                </div>

                <div class="card-control">

                    <label for="mov-${produto.id}">
                        Entrada / Saída (negativo):
                    </label>

                    <input
                        type="number"
                        id="mov-${produto.id}"
                        value="0"
                        step="1"
                    >

                </div>

            </div>
        `;

        container.appendChild(card);

    });

}

// Função para incluir um novo produto.
function incluirProduto() {

    // Solicita as informações do produto.
    const nome = prompt("Digite o nome do produto:");

    if (nome === null) return;

    if (nome.trim() === "") {
        alert("O nome do produto é obrigatório!");
        return;
    }

    const foto = prompt("Digite a URL da foto do produto:");

    if (foto === null) return;

    const unidade = prompt("Digite a unidade do produto:");

    if (unidade === null) return;

    const precoCompra = prompt("Digite o preço de compra:");

    if (precoCompra === null) return;

    const precoVenda = prompt("Digite o preço de venda:");

    if (precoVenda === null) return;

    const quantidadeEstoque = prompt("Digite a quantidade inicial:");

    if (quantidadeEstoque === null) return;

    // Converte os valores para números.
    const compra = Number(precoCompra.replace(",", "."));
    const venda = Number(precoVenda.replace(",", "."));
    const quantidade = Number(quantidadeEstoque);

    // Valida os dados.
    if (
        !foto.trim() ||
        !unidade.trim() ||
        !Number.isFinite(compra) ||
        !Number.isFinite(venda) ||
        compra < 0 ||
        venda < 0 ||
        !Number.isInteger(quantidade) ||
        quantidade < 0
    ) {

        alert("Verifique os dados informados!");

        return;
    }

    // Cria o objeto do novo produto.
    const novoProduto = {

        id: Date.now(),

        nome: nome.trim(),

        foto: foto.trim(),

        precoCompra: compra,

        precoVenda: venda,

        quantidadeEstoque: quantidade,

        unidade: unidade.trim()

    };

    // Adiciona o produto à lista.
    produtosData.push(novoProduto);

    // Atualiza a tela.
    renderizarCards();

    alert("Produto cadastrado com sucesso!");

}

// Inicializa o programa.
document.addEventListener("DOMContentLoaded", carregarEstoque);
