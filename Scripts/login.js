const frmPrincipal = document.getElementById("frmPrincipal");
const mensagemErro = document.getElementById("mensagemErro");

function setMensagem(texto, cor) {
    mensagemErro.textContent = texto;
    mensagemErro.style.color = cor;
}

function validarCPF(cpf) {
    return /^\d{11}$/.test(cpf);
}

frmPrincipal.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();

    if (!email || !cpf) {
        setMensagem("Preencha todos os campos.", "red");
        return;
    }

    if (!validarCPF(cpf)) {
        setMensagem("CPF invalido. Digite 11 numeros.", "red");
        return;
    }

    const resultado = globalThis.AppStore.loginUsuario({ email, cpf });
    if (!resultado.ok) {
        setMensagem(resultado.mensagem, "red");
        return;
    }

    setMensagem(resultado.mensagem, "green");

    setTimeout(() => {
        globalThis.location.replace("../Models/Home.html");
    }, 900);
});
