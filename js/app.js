const AppUI = {
    trocarTela: function (nomeTela) {
        document.querySelectorAll('.view').forEach(tela => {
            tela.classList.remove('active');
            setTimeout(() => {
                if (!tela.classList.contains('active')) tela.style.display = 'none';
            }, 400);
        });
        const telaDestino = document.getElementById(`view-${nomeTela}`);
        telaDestino.style.display = 'flex';
        setTimeout(() => telaDestino.classList.add('active'), 50);

        if (nomeTela === 'selection') {
            State.modoEdicaoAtivo = false;
            this.renderizarPerfis();
        }
    },

    renderizarPerfis: function () {
        const container = document.getElementById('lista-perfis-dom');
        container.innerHTML = '';
        State.perfisSalvos.forEach(perfil => {
            const li = document.createElement('li');
            li.className = 'cartao-perfil';
            const overlayEdicao = State.modoEdicaoAtivo ?
                `<div style="position:absolute; inset:0; background:rgba(0,0,0,0.6); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:2rem;"><i class="fa-solid fa-pencil"></i></div>` : '';
            li.innerHTML = `<div style="position: relative; width: 100%;"><img src="${perfil.avatar}" alt="${perfil.nome}">${overlayEdicao}</div><span style="color: var(--cor-texto-secundario); font-size: 1.2rem;">${perfil.nome}</span>`;

            li.onclick = () => {
                if (State.modoEdicaoAtivo) this.abrirEdicao(perfil.id);
                else Sistema.entrarComPerfil(perfil.id);
            };
            container.appendChild(li);
        });
        document.getElementById('btn-modo-edicao').innerText = State.modoEdicaoAtivo ? 'Concluir' : 'Gerenciar Perfis';
    },

    abrirEdicao: function (idPerfil = null) {
        State.idEdicaoAtual = idPerfil;
        const modoEditar = idPerfil !== null;
        document.getElementById('titulo-gerenciamento').innerText = modoEditar ? 'Editar Perfil' : 'Criar Perfil';
        document.getElementById('btn-excluir').style.display = modoEditar ? 'block' : 'none';

        if (modoEditar) {
            const perfil = State.perfisSalvos.find(p => p.id === idPerfil);
            if (!perfil) {
                console.warn(`Perfil com id ${idPerfil} não encontrado para editar.`);
                return;
            }
            document.getElementById('input-nome-perfil').value = perfil.nome;
            State.avatarTemporario = perfil.avatar;
        } else {
            document.getElementById('input-nome-perfil').value = '';
            State.avatarTemporario = DadosMock.avatares[0];
        }
        this.renderizarOpcoesAvatar();
        this.trocarTela('manage');
    },

    renderizarOpcoesAvatar: function () {
        document.getElementById('preview-avatar').src = State.avatarTemporario;
        const container = document.getElementById('container-avatares');
        container.innerHTML = '';
        DadosMock.avatares.forEach(imgUrl => {
            const img = document.createElement('img');
            img.src = imgUrl;
            if (State.avatarTemporario === imgUrl) img.classList.add('selecionado');
            img.onclick = () => {
                State.avatarTemporario = imgUrl;
                this.renderizarOpcoesAvatar();
            };
            container.appendChild(img);
        });
    },

    fazerLogin: function (perfil) {
        State.perfilLogado = perfil;
        document.getElementById('avatar-nav-ativo').src = perfil.avatar;

        DadosMock.filmes.minhaLista = [DadosMock.filmes.trending[0], DadosMock.filmes.originais[1], DadosMock.filmes.series[2]];

        const abaInicio = document.querySelector('#nav-abas li a');
        this.mudarAba('inicio', abaInicio);
        this.trocarTela('browse');
        window.scrollTo(0, 0);
    },

    mudarAba: function (aba, elementoClicado) {
        if (elementoClicado) {
            document.querySelectorAll('#nav-abas a').forEach(a => a.classList.remove('ativo'));
            elementoClicado.classList.add('ativo');
        }

        const menu = document.querySelector('.menu-navegacao');
        if (menu && menu.classList.contains('ativo')) {
            menu.classList.remove('ativo');
        }

        const container = document.getElementById('container-carrosseis');
        const banner = document.getElementById('banner-principal');
        const titulo = document.getElementById('banner-titulo');
        const desc = document.getElementById('banner-descricao');
        container.innerHTML = '';

        if (aba === 'inicio') {
            banner.style.backgroundImage = "url('https://static.crunchyroll.com/cr-acquisition/assets/img/start/hero/brazil-latam/background-desktop@2x.webp')";
            titulo.innerText = "Cyberpunk 2077";
            desc.innerText = "Acompanhe a saga de um mercenário em uma metrópole obcecada por poder, glamour e modificações corporais.";
            container.innerHTML += this.criarLinhaHTML(`Continuar assistindo como ${State.perfilLogado.nome}`, DadosMock.filmes.originais.slice(0, 3), "Originais");
            container.innerHTML += this.criarLinhaHTML("Em Alta (Trending)", DadosMock.filmes.trending, "Filmes em Alta");
        }
        else if (aba === 'series') {
            banner.style.backgroundImage = "url('https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')";
            titulo.innerText = "Dark Paths";
            desc.innerText = "Uma nova série investigativa que vai prender você do início ao fim com seus mistérios.";
            container.innerHTML += this.criarLinhaHTML("Séries em Alta", DadosMock.filmes.series, "Séries de Suspense");
        }
        else if (aba === 'filmes') {
            banner.style.backgroundImage = "url('https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')";
            titulo.innerText = "O Horizonte";
            desc.innerText = "Um filme épico e reflexivo sobre os limites da humanidade no espaço sideral profundo.";
            container.innerHTML += this.criarLinhaHTML("Filmes de Ficção", DadosMock.filmes.trending, "Filmes de Ficção Científica");
        }
        else if (aba === 'minha_lista') {
            banner.style.backgroundImage = "url('https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/cyberpunk-2077.jpg')";
            titulo.innerText = "Minha Lista";
            desc.innerText = "Sua seleção personalizada de filmes e séries para maratonar durante o final de semana.";
            container.innerHTML += this.criarLinhaHTML("Adicionados Recentemente", DadosMock.filmes.minhaLista, "Minha Lista de Favoritos");
        }
    },

    extrairIDYouTube: function (url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    },

    iniciarTrailerCard: function (elemento, youtubeUrl) {
        const ytId = this.extrairIDYouTube(youtubeUrl);
        if (!ytId) return;

        const timeoutId = setTimeout(() => {
            const containerVideo = elemento.querySelector('.video-container');
            if (containerVideo) {
                containerVideo.innerHTML = `\n            <iframe src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&controls=0&modestbranding=1&loop=1&playlist=${ytId}" \n                    frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>\n            </iframe>`;
            }
            elemento.classList.add('hover-ativo');
        }, 500);

        elemento.dataset.hoverTimeoutId = timeoutId;
    },

    pararTrailerCard: function (elemento) {
        const timeoutId = Number(elemento.dataset.hoverTimeoutId);
        if (timeoutId) {
            clearTimeout(timeoutId);
            delete elemento.dataset.hoverTimeoutId;
        }

        elemento.classList.remove('hover-ativo');
        const containerVideo = elemento.querySelector('.video-container');
        if (containerVideo) {
            containerVideo.innerHTML = '';
        }
    },

    criarLinhaHTML: function (titulo, arrayImagens = [], categoriaParaIA) {
        const imagensHTML = arrayImagens.map(filme => `
    <div class="item-filme" 
         onmouseenter="AppUI.iniciarTrailerCard(this, '${filme.youtube}')" 
         onmouseleave="AppUI.pararTrailerCard(this)">
        <img src="${filme.img}" class="capa-estatica" alt="Capa Filme">
        
        <div class="card-hover-detalhes">
            <div class="video-container"></div>
            
            <div class="barra-progresso">
                <div class="progresso-preenchido" style="width: ${filme.progress || 0}%"></div>
            </div>
            
            <div class="info-container">
                <div class="botoes-hover">
                    <div class="botao-redondo play"><i class="fa-solid fa-play"></i></div>
                    <div class="botao-redondo"><i class="fa-solid fa-check"></i></div>
                    <div class="botao-redondo"><i class="fa-regular fa-thumbs-up"></i></div>
                    <div class="botao-redondo" style="margin-left: auto;"><i class="fa-solid fa-chevron-down"></i></div>
                </div>
                
                <div class="meta-hover">
                    <span class="meta-relevancia">92% relevante</span>
                    <span class="meta-idade">16</span>
                    <span>10 temps</span>
                    <span class="meta-idade">HD</span>
                </div>
                
                <div class="meta-tags">
                    Empolgante • Animação • Ficção
                </div>
            </div>
        </div>
    </div>
        `).join('');
        return `<div class="linha-filmes"><h3>${titulo}</h3><div class="carrossel-puro">${imagensHTML}</div></div>`;
    }
};