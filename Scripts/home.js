const livros = [
    {
        titulo: "Dom Casmurro",
        autor: "Machado de Assis"
    },
    {
        titulo: "Harry Potter",
        autor: "J. K. Rowling"
    },
    {
        titulo: "1984",
        autor: "George Orwell"
    }
];

function mostrarSugestao() {

    const indice =
        Math.floor(Math.random() * livros.length);

    const livro = livros[indice];

    document.getElementById("titulo-sugestao").textContent =
        livro.titulo;

    document.getElementById("autor-sugestao").textContent =
        livro.autor;
}

mostrarSugestao();