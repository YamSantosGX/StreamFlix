const State = {
    perfisSalvos: [],
    perfilLogado: null,
    modoEdicaoAtivo: false,
    idEdicaoAtual: null,
    avatarTemporario: '',

    carregar: function() {
        const dados = localStorage.getItem('@StreamFlix_Perfis');
        if (dados) {
            this.perfisSalvos = JSON.parse(dados);
        } else {
            // Padrão inicial: 4 perfis usando imagens locais em /assets
            // Alterado para usar as imagens locais fornecidas pelo usuário
            this.perfisSalvos = [
                { id: 1, nome: 'Perfil 1', avatar: 'assets/Perfil_1.png' },
                { id: 2, nome: 'Perfil 2', avatar: 'assets/perfil_2.png' },
                { id: 3, nome: 'Perfil 3', avatar: 'assets/perfil_3.png' },
                { id: 4, nome: 'Perfil 4', avatar: 'assets/perfil_4.png' }
            ];
            this.salvar();
        }
    },

    salvar: function() {
        localStorage.setItem('@StreamFlix_Perfis', JSON.stringify(this.perfisSalvos));
    },

    adicionarOuAtualizarPerfil: function(nome) {
        if (this.idEdicaoAtual !== null) {
            const perfil = this.perfisSalvos.find(p => p.id === this.idEdicaoAtual);
            if (!perfil) {
                console.warn(`Perfil com id ${this.idEdicaoAtual} não encontrado ao atualizar.`);
                return;
            }
            perfil.nome = nome;
            perfil.avatar = this.avatarTemporario;
        } else {
            this.perfisSalvos.push({ 
                id: Date.now(), 
                nome: nome, 
                avatar: this.avatarTemporario 
            });
        }
        this.salvar();
    },

    excluirPerfilAtual: function() {
        this.perfisSalvos = this.perfisSalvos.filter(p => p.id !== this.idEdicaoAtual);
        this.salvar();
    }
};