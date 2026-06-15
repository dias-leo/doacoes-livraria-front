const frmDoacao = document.getElementById("frmDoacao");
const msgStatus = document.getElementById("msgStatus");

function setMensagem(texto, cor) {
    msgStatus.textContent = texto;
    msgStatus.style.color = cor;
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(telefone) {
    return /^\d{10,11}$/.test(telefone);
}

frmDoacao.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const email = document.getElementById("email").value.trim();
    const titulo = document.getElementById("tituloLivro").value.trim();
    const autor = document.getElementById("autorLivro").value.trim();

    if (!nome || !telefone || !email || !titulo || !autor) {
        setMensagem("Preencha todos os campos.", "red");
        return;
    }

    if (!validarEmail(email)) {
        setMensagem("E-mail invalido.", "red");
        return;
    }

    if (!validarTelefone(telefone)) {
        setMensagem("Telefone invalido. Use 10 ou 11 digitos.", "red");
        return;
    }

    const resultado = globalThis.AppStore.doarLivro({ nome, telefone, email, titulo, autor });
    if (!resultado.ok) {
        setMensagem(resultado.mensagem || "Erro ao registrar doacao.", "red");
        return;
    }

    setMensagem(resultado.mensagem, "green");
    frmDoacao.reset();
});






