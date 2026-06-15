const frmCadastro = document.getElementById("frmCadastro");
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

function validarCPF(cpf) {
    return /^\d{11}$/.test(cpf);
}

frmCadastro.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cpf = document.getElementById("cpf").value.trim();

    if (!nome || !email || !telefone || !cpf) {
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

    if (!validarCPF(cpf)) {
        setMensagem("CPF invalido. Digite 11 numeros.", "red");
        return;
    }

    const resultado = globalThis.AppStore.cadastrarUsuario({ nome, email, telefone, cpf });
    if (!resultado.ok) {
        setMensagem(resultado.mensagem, "red");
        return;
    }

    setMensagem(resultado.mensagem, "green");
    frmCadastro.reset();

    setTimeout(() => {
        globalThis.location.replace("../Models/login.html");
    }, 900);
});
