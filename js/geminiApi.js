const IA = {
    apiKey: "",

    // Função core com Exponential Backoff (regras do sistema) para resiliência
    async chamarGemini(prompt, configJSON = false, tentativas = 5) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: "Você é o especialista em cinema da plataforma StreamFlix. Responda de forma criativa e empolgante, usando português do Brasil." }] }
        };

        // Se solicitarmos JSON estruturado, configuramos o Schema
        if (configJSON) {
            payload.generationConfig = {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        filmes: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    titulo: { type: "STRING", description: "Título fictício do filme" },
                                    genero: { type: "STRING", description: "Gênero do filme" },
                                    sinopse: { type: "STRING", description: "Sinopse empolgante de 2 a 3 frases" }
                                }
                            }
                        }
                    }
                }
            };
        }

        const atrasos = [1000, 2000, 4000, 8000, 16000];

        for (let i = 0; i < tentativas; i++) {
            try {
                const resposta = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!resposta.ok) throw new Error(`Erro na API: ${resposta.status}`);
                const dados = await resposta.json();
                return dados.candidates[0].content.parts[0].text;
            } catch (erro) {
                if (i === tentativas - 1) {
                    return configJSON ? null : "<p style='color:red;'>Desculpe, a rede neural do StreamFlix está sobrecarregada agora. Tente novamente mais tarde.</p>";
                }
                // Espera antes de tentar de novo (Exponential Backoff)
                await new Promise(resolve => setTimeout(resolve, atrasos[i]));
            }
        }
    },

    // Funcionalidade 1: Gerar Sinopse ao clicar no pôster
    async gerarSinopse(categoria) {
        this.abrirModal("Gerando detalhes exclusivos... ✨");

        // Pega o nome do usuário logado para uma experiência personalizada
        const nomeUsuario = Sistema.estado.perfilLogado ? Sistema.estado.perfilLogado.nome : "usuário";

        const prompt = `Estou no StreamFlix e acabei de clicar em um pôster da categoria "${categoria}". 
                Invente um filme INÉDITO e FICTÍCIO dessa categoria. 
                Crie um Título, o Ano de Lançamento, e uma sinopse cativante. 
                Ao final, adicione uma frase recomendando o filme especificamente para o perfil chamado "${nomeUsuario}".
                Formate a resposta em HTML limpo usando <h3>, <strong> e <p>. Não use blocos de código markdown (\`\`\`).`;

        const respostaHtml = await this.chamarGemini(prompt, false);
        document.getElementById('modal-ia-body').innerHTML = respostaHtml;
    },

    // Funcionalidade 2: Busca Inteligente na Navbar
    async buscarRecomendacoes() {
        const input = document.getElementById('input-busca-ia');
        const termo = input.value.trim();

        if (!termo) {
            alert("Digite o tipo de filme que você deseja antes de clicar no ✨.");
            return;
        }

        this.abrirModal(`Analisando: "${termo}" ✨`);

        const prompt = `O usuário pesquisou por: "${termo}".
                Crie 3 ideias originais e fictícias de filmes que combinem com esse clima/pedido.`;

        // Pede a resposta em JSON estruturado
        const respostaJsonStr = await this.chamarGemini(prompt, true);

        if (!respostaJsonStr) {
            document.getElementById('modal-ia-body').innerHTML = "<p>Ocorreu um erro ao buscar. Tente novamente.</p>";
            return;
        }

        try {
            const dados = JSON.parse(respostaJsonStr);
            let html = `<p style="margin-bottom: 20px; color: #aaa;">Encontrei 3 produções perfeitas para você:</p>`;

            dados.filmes.forEach(filme => {
                html += `
                            <div class="ai-filme-card">
                                <h4>${filme.titulo}</h4>
                                <span>${filme.genero}</span>
                                <p>${filme.sinopse}</p>
                            </div>
                        `;
            });

            document.getElementById('modal-ia-body').innerHTML = html;
            input.value = ''; // limpa o input
        } catch (e) {
            document.getElementById('modal-ia-body').innerHTML = "<p>A IA ficou um pouco confusa. Tente novamente.</p>";
        }
    },

    abrirModal(textoCarregamento) {
        document.getElementById('modal-ia-titulo').innerHTML = `<i class="fa-solid fa-wand-magic-sparkles" style="color: var(--cor-primaria);"></i> IA do StreamFlix ✨`;
        document.getElementById('modal-ia-body').innerHTML = `
                    <div style="text-align:center; padding: 40px 0;">
                        <div class="loader"></div>
                        <p style="margin-top: 20px; color: var(--cor-primaria);">${textoCarregamento}</p>
                    </div>
                `;
        document.getElementById('modal-ia').classList.add('ativo');
    },

    fecharModal() {
        document.getElementById('modal-ia').classList.remove('ativo');
    }
};
