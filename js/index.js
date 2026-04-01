// Funções globais mapeadas para os botões do HTML (onclick)
const Sistema = {
    alternarModoEdicao: () => {
        State.modoEdicaoAtivo = !State.modoEdicaoAtivo;
        AppUI.renderizarPerfis();
    },
    abrirEdicao: (id) => AppUI.abrirEdicao(id),
    trocarTela: (tela) => AppUI.trocarTela(tela),
    entrarComPerfil: (idPerfil) => {
        const perfilSelecionado = State.perfisSalvos.find(p => p.id === idPerfil);
        if (!perfilSelecionado) return alert('Perfil não encontrado. Por favor, selecione outro.');
        localStorage.setItem('@StreamFlix_PerfilAtivo', String(perfilSelecionado.id));
        window.location.href = 'streamflix.html';
    },
    fazerLogout: () => {
        localStorage.removeItem('@StreamFlix_PerfilAtivo');
        State.perfilLogado = null;
        window.location.href = 'index.html';
    },
    toggleMenu: () => {
        const menu = document.querySelector('.menu-navegacao');
        if (!menu) return;
        menu.classList.toggle('ativo');
    },
    salvarPerfil: () => {
        const nome = document.getElementById('input-nome-perfil').value.trim();
        if (!nome) return alert("O nome não pode ser vazio!");
        State.adicionarOuAtualizarPerfil(nome);
        AppUI.trocarTela('selection');
    },
    excluirPerfil: () => {
        if(confirm("Deseja realmente excluir este perfil?")) {
            State.excluirPerfilAtual();
            AppUI.trocarTela('selection');
        }
    },
    mudarAba: (aba, el) => AppUI.mudarAba(aba, el)
};

// Evento disparado quando o site terminar de carregar
document.addEventListener('DOMContentLoaded', () => {
    State.carregar();

    const containerPerfis = document.getElementById('lista-perfis-dom');
    const navAbas = document.getElementById('nav-abas');

    if (containerPerfis) {
        // Página de seleção de perfis
        AppUI.renderizarPerfis();
        document.body.style.overflow = 'hidden';
    } else {
        // Página streamflix
        const idAtivo = Number(localStorage.getItem('@StreamFlix_PerfilAtivo'));
        if (!idAtivo) {
            window.location.href = 'index.html';
            return;
        }

        const perfil = State.perfisSalvos.find(p => p.id === idAtivo);
        if (!perfil) {
            localStorage.removeItem('@StreamFlix_PerfilAtivo');
            window.location.href = 'index.html';
            return;
        }

        AppUI.fazerLogin(perfil);

        if (navAbas) {
            // destaca a primeira aba carregada
            const abaInicio = navAbas.querySelector('li a');
            if (abaInicio) abaInicio.classList.add('ativo');
        }

        document.body.style.overflow = 'auto';
    }

    window.addEventListener('scroll', () => {
        const header = document.getElementById('navbar');
        if (!header) return;
        if (window.scrollY > 10) header.classList.add('rolagem');
        else header.classList.remove('rolagem');
    });

    const inputIA = document.getElementById('input-busca-ia');
    if (inputIA) {
        inputIA.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') IA.buscarRecomendacoes();
        });
    }
});