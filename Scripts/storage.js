(function () {
    const KEYS = {
        usuarios: "biblioteca_usuarios",
        usuarioLogado: "biblioteca_usuario_logado",
        doacoes: "biblioteca_doacoes",
        acervo: "biblioteca_acervo"
    };

    const acervoInicial = [
        { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", status: "Disponivel" },
        { id: 2, titulo: "Harry Potter", autor: "J. K. Rowling", status: "Disponivel" },
        { id: 3, titulo: "1984", autor: "George Orwell", status: "Indisponivel" },
        { id: 4, titulo: "Senhor dos Aneis", autor: "J. R. R. Tolkien", status: "Disponivel" }
    ];

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function ensureAcervoSeed() {
        const acervo = readJson(KEYS.acervo, null);
        if (!Array.isArray(acervo) || acervo.length === 0) {
            writeJson(KEYS.acervo, acervoInicial);
        }
    }

    function getUsuarios() {
        return readJson(KEYS.usuarios, []);
    }

    function saveUsuarios(usuarios) {
        writeJson(KEYS.usuarios, usuarios);
    }

    function cadastrarUsuario(data) {
        const usuarios = getUsuarios();
        const email = String(data.email || "").trim().toLowerCase();
        const cpf = String(data.cpf || "").trim();

        const existe = usuarios.some((u) => u.email.toLowerCase() === email || u.cpf === cpf);
        if (existe) {
            return { ok: false, mensagem: "Ja existe usuario cadastrado com este email ou CPF." };
        }

        usuarios.push({
            nome: String(data.nome || "").trim(),
            email,
            telefone: String(data.telefone || "").trim(),
            cpf
        });

        saveUsuarios(usuarios);
        return { ok: true, mensagem: "Cadastro realizado com sucesso." };
    }

    function loginUsuario(data) {
        const usuarios = getUsuarios();
        const email = String(data.email || "").trim().toLowerCase();
        const cpf = String(data.cpf || "").trim();

        const usuario = usuarios.find((u) => u.email.toLowerCase() === email && u.cpf === cpf);
        if (!usuario) {
            return { ok: false, mensagem: "Email ou CPF invalidos." };
        }

        writeJson(KEYS.usuarioLogado, usuario);
        return { ok: true, mensagem: "Login realizado com sucesso.", usuario };
    }

    function getUsuarioLogado() {
        return readJson(KEYS.usuarioLogado, null);
    }

    function doarLivro(data) {
        ensureAcervoSeed();

        const doacoes = readJson(KEYS.doacoes, []);
        const acervo = readJson(KEYS.acervo, []);

        const novaDoacao = {
            id: Date.now(),
            nome: String(data.nome || "").trim(),
            telefone: String(data.telefone || "").trim(),
            email: String(data.email || "").trim().toLowerCase(),
            titulo: String(data.titulo || "").trim(),
            autor: String(data.autor || "").trim(),
            data: new Date().toISOString()
        };

        doacoes.push(novaDoacao);
        writeJson(KEYS.doacoes, doacoes);

        acervo.push({
            id: novaDoacao.id,
            titulo: novaDoacao.titulo,
            autor: novaDoacao.autor || "Autor nao informado",
            status: "Disponivel"
        });
        writeJson(KEYS.acervo, acervo);

        return { ok: true, mensagem: "Doacao registrada com sucesso." };
    }

    function listarAcervo() {
        ensureAcervoSeed();
        return readJson(KEYS.acervo, []);
    }

    function reservarLivro(id) {
        ensureAcervoSeed();

        const acervo = readJson(KEYS.acervo, []);
        const indice = acervo.findIndex((livro) => Number(livro.id) === Number(id));

        if (indice === -1) {
            return { ok: false, mensagem: "Livro nao encontrado." };
        }

        const statusAtual = String(acervo[indice].status || "").toLowerCase();
        if (statusAtual.includes("indispon")) {
            return { ok: false, mensagem: "Este livro ja esta indisponivel." };
        }

        acervo[indice].status = "Indisponivel";
        acervo[indice].disponivel = false;
        writeJson(KEYS.acervo, acervo);

        return { ok: true, mensagem: "Livro reservado com sucesso." };
    }

    globalThis.AppStore = {
        cadastrarUsuario,
        loginUsuario,
        getUsuarioLogado,
        doarLivro,
        listarAcervo,
        reservarLivro
    };
})();
