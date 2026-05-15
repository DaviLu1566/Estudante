/*
Estado da transformação
false = humano
true = herói
*/
let sc_davi_transformado = false;

/*
Função que faz a transformação
*/
function sc_davi_transformar() {

    const sc_davi_nome = document.getElementById("sc_davi_nome");
    const sc_davi_foto = document.getElementById("sc_davi_foto");
    const sc_davi_lista = document.getElementById("sc_davi_lista");
    const sc_davi_descricao = document.getElementById("sc_davi_descricao_perfil");
    const sc_davi_btn = document.getElementById("sc_davi_btn_transformar");

    /* ELEMENTOS PARA MUDAR COR */
    const sc_davi_perfil = document.querySelector(".sc_davi_perfil");
    const sc_davi_descricao_box = document.querySelector(".sc_davi_descricao");

   if (!sc_davi_transformado) {

    /* FLASH + TREMOR */
    document.body.classList.add("flash_transformacao");
    document.body.classList.add("tela_tremendo");

    /* ESPERA O EFEITO */
    setTimeout(() => {

        /*
        TRANSFORMA EM KAMEN RIDER BLACK RX
        */

        sc_davi_nome.textContent = "Kamen Rider Black RX";

        sc_davi_foto.src = "kamen-rider-rx.webp";

        sc_davi_lista.innerHTML = `
            <li>Nome: Kamen Rider Black RX</li>
            <li>Idade: 19</li>
            <li>Ocupação: Guerreiro solar</li>
        `;

        sc_davi_descricao.textContent =
            "Kamen Rider Black RX é a evolução do herói Kamen Rider Black. Após ser lançado no espaço pelo império Crisis, Davi Lupette recebe o poder do Sol e se torna o RX. Seu objetivo é proteger a Terra e derrotar o mal.";

        sc_davi_btn.textContent = "Voltar!";

        /*  ATIVA CORES RX */
        document.body.classList.add("rx_ativo");
        sc_davi_perfil.classList.add("rx_ativo");
        sc_davi_descricao_box.classList.add("rx_ativo");
        sc_davi_btn.classList.add("rx_ativo");

        sc_davi_transformado = true;

        /* REMOVE EFEITOS */
        document.body.classList.remove("flash_transformacao");
        document.body.classList.remove("tela_tremendo");

    }, 500);

    } else {

        /*
        VOLTA AO NORMAL
        */

        sc_davi_nome.textContent = "Quem sou eu ?";

        sc_davi_foto.src = "Davi-Lupette.jpg";

        sc_davi_lista.innerHTML = `
            <li>Nome: Davi Lupete Trigueiro Mariano.</li>
            <li>Idade: 19</li>
            <li>Ocupação: Estudante</li>
        `;

        sc_davi_descricao.textContent =
            "Olá, sou o Davi, sou um estudante de Análise e Desenvolvimento de Sistemas na faculdade de ciências médicas de São Paulo.";

        sc_davi_btn.textContent = "Henshin!";

        /*  REMOVE CORES RX */
        document.body.classList.remove("rx_ativo");
        sc_davi_perfil.classList.remove("rx_ativo");
        sc_davi_descricao_box.classList.remove("rx_ativo");
        sc_davi_btn.classList.remove("rx_ativo");

        sc_davi_transformado = false;
    }
}

/*
Evento do botão
*/
document
.getElementById("sc_davi_btn_transformar")
.addEventListener("click", sc_davi_transformar);
