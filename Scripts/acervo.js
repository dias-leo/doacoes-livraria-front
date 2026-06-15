let paginaAtual = 1;
const livrosPorPagina = 8;
let livrosFiltrados = [];

function getLivros() {
    return globalThis.AppStore.listarAcervo();
}

function normalizarDisponibilidade(livro) {
    if (typeof livro.disponivel === "boolean") {
        return livro.disponivel;
    }

    const status = String(livro.status || "").toLowerCase();
    if (status.includes("indispon")) {
        return false;
    }

    if (status.includes("dispon")) {
        return true;
    }

    return true;
}

function renderizar(lista) {
    const container = document.getElementById("lista-livros");
    container.innerHTML = "";

    if (!lista.length) {
        container.innerHTML = "<p>Nenhum livro encontrado.</p>";
        return;
    }

    lista.forEach((livro) => {
        const disponivel = normalizarDisponibilidade(livro);
        const status = disponivel ? "Disponivel" : "Indisponivel";
        const acao = disponivel
            ? `<button onclick="reservarLivro(${livro.id})">Reservar</button>`
            : "<p id=\"ind\">Indisponivel</p>";

        container.innerHTML += `
            <div class="livro">
                <h3>${livro.titulo || "Titulo nao informado"}</h3>
                <p>${livro.autor || "Autor nao informado"}</p>
                <p>${status}</p>
                ${acao}
            </div>
        `;
    });
}

function mostrarPagina() {
    const inicio = (paginaAtual - 1) * livrosPorPagina;
    const fim = inicio + livrosPorPagina;
    renderizar(livrosFiltrados.slice(inicio, fim));
}

function atualizarFiltro() {
    const termo = document.getElementById("busca").value.trim().toLowerCase();
    const livros = getLivros();

    livrosFiltrados = livros.filter((livro) => {
        const titulo = String(livro.titulo || "").toLowerCase();
        const autor = String(livro.autor || "").toLowerCase();
        return !termo || titulo.includes(termo) || autor.includes(termo);
    });

    paginaAtual = 1;
    mostrarPagina();
}

function proximaPagina() {
    const totalPaginas = Math.ceil(livrosFiltrados.length / livrosPorPagina) || 1;
    if (paginaAtual < totalPaginas) {
        paginaAtual += 1;
        mostrarPagina();
    }
}

function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual -= 1;
        mostrarPagina();
    }
}

function buscarLivros() {
    atualizarFiltro();
}

function reservarLivro(id) {
    const resultado = globalThis.AppStore.reservarLivro(id);

    if (!resultado.ok) {
        alert(resultado.mensagem);
        return;
    }

    atualizarFiltro();
}

globalThis.proximaPagina = proximaPagina;
globalThis.paginaAnterior = paginaAnterior;
globalThis.buscarLivros = buscarLivros;
globalThis.reservarLivro = reservarLivro;

globalThis.addEventListener("DOMContentLoaded", () => {
    const termo = new URLSearchParams(location.search).get("busca");
    if (termo) {
        document.getElementById("busca").value = termo;
    }

    atualizarFiltro();
});