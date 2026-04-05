# 🎬 StreamFlix

StreamFlix é uma plataforma de streaming inspirada na Netflix, desenvolvida como um projeto educacional da **Alura** com personalizações e funcionalidades extras adicionadas. A aplicação combina **JavaScript vanilla**, **HTML5**, **CSS3** e integração com **API Gemini** para uma experiência inteligente e interativa.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Páginas Principais](#páginas-principais)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Usar](#como-usar)
- [Créditos](#créditos)

---

## 👀 Visão Geral

StreamFlix simula uma plataforma completa de streaming com:
- ✨ Sistema de múltiplos perfis de usuário
- 🎥 Catálogo de filmes e séries organizados por categorias
- 🤖 Recomendações inteligentes com IA (Google Gemini)
- 📱 Design responsivo e moderno
- ▶️ Previsualizações de trailers ao passar o mouse
- 💾 Persistência de dados com localStorage

---

## 📄 Páginas Principais

### 1. **Tela de Seleção de Perfil** (`index.html`)
A primeira tela que o usuário vê ao abrir a aplicação.

**Funcionalidades:**
- Exibir perfis criados anteriormente
- Criar novo perfil com nome e avatar customizado
- Editar perfis existentes
- Deletar perfis
- Gerenciar múltiplos perfis de acesso

**Componentes Visuais:**
- Cards de perfil com avatares
- Botões de ação (Adicionar Perfil, Gerenciar Perfis)
- Painel de edição com seletor de avatares

### 2. **Página Principal de Conteúdo** (`streamflix.html`)
O coração da aplicação onde os usuários navegam pelo catálogo.

**Funcionalidades:**
- Navegação por abas (Início, Séries, Filmes, Minha Lista)
- Banner principal dinâmico com imagem de fundo
- Carrosséis horizontais de filmes/séries
- Busca inteligente com IA
- Modal de detalhes gerados por IA
- Menu responsivo (hamburger menu)
- Visualização do perfil ativo na navbar

**Abas Disponíveis:**
- **Início:** Conteúdo em alta + Originais + Continuação de assistência
- **Séries:** Séries em alta com suspense e drama
- **Filmes:** Filmes de ficção científica e diversos gêneros
- **Minha Lista:** Seleção personalizada de favoritos

---

## 📁 Estrutura do Projeto

```
StreamFlix/
├── index.html                 # Página de seleção de perfil
├── streamflix.html            # Página principal da aplicação
├── css/
│   ├── style.css              # Estilos gerais da app
│   ├── global.css             # Variáveis CSS e estilos globais
│   ├── streamflix.css         # Estilos específicos do catálogo
│   ├── modal-ia.css           # Estilos do modal da IA
│   └── responsividade.css     # Media queries para mobile
├── js/
│   ├── data.js                # Dados mockados (filmes, avatares)
│   ├── state.js               # Gerenciamento de estado global
│   ├── app.js                 # Lógica de UI (AppUI object)
│   ├── geminiApi.js           # Integração com Google Gemini
│   └── index.js               # Inicialização e controller principal
└── assets/
    ├── Logo_StreamFlix.png    # Logo da aplicação
    ├── Perfil_1.png           # Imagem de perfil padrão 1
    ├── perfil_2.png           # Imagem de perfil padrão 2
    ├── perfil_3.png           # Imagem de perfil padrão 3
    └── perfil_4.png           # Imagem de perfil padrão 4
```

---

## ⚙️ Funcionalidades Detalhadas

### 🔐 Sistema de Perfis

**Arquivo:** `js/app.js` + `js/state.js`

- **Criar Perfil:** Novo usuário com nome e avatar customizado
- **Editar Perfil:** Modificar nome e avatar de perfis existentes
- **Deletar Perfil:** Remover perfis da aplicação
- **Login:** Trocar entre perfis salvos
- **Logout:** Retornar à tela de seleção

```javascript
// Exemplo de estrutura de perfil
{
  id: 1,
  nome: "Perfil 1",
  avatar: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=400&q=80"
}
```

### 🎬 Catálogo Dinâmico

**Arquivo:** `js/data.js` + `js/app.js`

**Categorias:**
- **Trending:** Filmes em alta (Top 10)
- **Originais:** Produções exclusivas StreamFlix
- **Séries:** Séries populares e em alta
- **Minha Lista:** Seleção personalizada do usuário

**Cada item contém:**
```javascript
{
  img: "url_da_imagem",
  youtube: "link_do_trailer",
  top10: true/false,
  badge: "Clássico/Nova",
  progress: 0-100  // % assistido
}
```

### ▶️ Trailers Interativos

**Arquivo:** `js/app.js` - Métodos `iniciarTrailerCard()` e `pararTrailerCard()`

- Ao passar o mouse sobre um filme, o trailer do YouTube é carregado
- Timeout de 500ms antes de carregar (otimização de performance)
- Ao sair o mouse, o trailer é removido
- Integração com YouTube Embed API

### 🤖 IA Gemini - Funcionalidades

**Arquivo:** `js/geminiApi.js`

#### 1. **Geração de Sinopses**
- Clique no botão "Detalhes" em um filme
- IA gera sinopse fictícia e personalizada
- Resposta em HTML formatado
- Recomendação específica para o perfil ativo

#### 2. **Busca Inteligente**
- Digite um tipo de filme na barra de busca
- Clique no botão ✨ (magic wand)
- IA retorna 3 filmes fictícios compatíveis
- Resposta em formato JSON estruturado

**Configurações Gemini:**
- Modelo: `gemini-2.5-flash-preview-09-2025`
- System Instruction: Especialista em cinema brasileiro
- Exponential Backoff para resiliência
- Até 5 tentativas com delays progressivos

### 📱 Navegação e Menu

**Arquivo:** `js/app.js` + `js/index.js`

- Menu responsivo com hamburger button
- Abas dinâmicas (Início, Séries, Filmes, Minha Lista)
- Banner principal muda conforme a aba
- Busca inteligente na navbar
- Avatar do perfil ativo com logout
- Scroll suave entre conteúdo

### 💾 Persistência de Dados

**Arquivo:** `js/state.js`

- localStorage para salvar perfis
- Sincronização automática entre abas
- Recuperação de dados ao recarregar página
- Lista "Minha Lista" persistida

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5:** Estrutura semântica
- **CSS3:** 
  - Flexbox para layouts
  - CSS Grid para carrosséis
  - Variáveis CSS (--cor-primaria, --cor-secundaria, etc.)
  - Animações e transições suaves
  - Media Queries para responsividade
- **JavaScript Vanilla (ES6+):**
  - Promises e Async/Await
  - Arrow Functions
  - Destructuring
  - Template Literals
  - DOM Manipulation

### Bibliotecas e APIs
- **Font Awesome 6.5.0:** Ícones (play, check, thumbs-up, etc.)
- **Google Gemini API:** Geração de conteúdo com IA
- **YouTube Embed API:** Previewização de trailers
- **Unsplash API:** Imagens de alta qualidade

### Recursos Externos
- **Unsplash:** Imagens dinâmicas de filmes e avatares
- **YouTube:** Trailers para previewização
- **Crunchyroll/GameRant:** Imagens de referência

---

## 🚀 Como Usar

### 1. **Abrir a Aplicação**
```bash
# Abra o arquivo index.html em um navegador moderno
```

### 2. **Criar seu Perfil**
- Clique em "Adicionar Perfil"
- Digite seu nome
- Selecione um avatar
- Clique em "Salvar"

### 3. **Explorar o Catálogo**
- Clique no seu perfil para entrar
- Navegue pelas abas (Início, Séries, Filmes, Minha Lista)
- Passe o mouse sobre filmes para ver trailers
- Clique em "Detalhes" para gerar sinopses com IA

### 4. **Usar a Busca Inteligente**
- Digite um tipo de filme na barra de busca
- Clique no botão ✨
- Veja recomendações geradas por IA

### 5. **Gerenciar Perfis**
- Clique em "Gerenciar Perfis" (aba seleção)
- Edite ou delete perfis existentes
- Modo edição mostra ícones de edição nos cards

---

## 🎨 Variáveis CSS Personalizadas

```css
--cor-primaria: rgb(200, 0, 255);      /* Purple Neon */
--cor-secundaria: rgb(255, 0, 128);    /* Pink Neon */
--cor-fundo: #141414;                   /* Preto profundo */
--cor-texto-primario: #ffffff;          /* Branco */
--cor-texto-secundario: #999;           /* Cinza */
```

---

## 📝 Estrutura de Arquivos JS

### `data.js`
Dados mockados da aplicação:
- Array de avatares (Unsplash + assets locais)
- Catálogo de filmes por categoria
- Informações de trailers YouTube

### `state.js`
Gerenciamento de estado global:
- Perfis salvos
- Perfil logado atualmente
- Modo edição ativo
- Avatar temporário em edição

### `app.js`
Lógica de UI principal (objeto AppUI):
- `trocarTela()` - Transição entre telas
- `renderizarPerfis()` - Renderizar lista de perfis
- `mudarAba()` - Mudar entre abas de conteúdo
- `criarLinhaHTML()` - Gerar carrosséis de filmes
- `iniciarTrailerCard()` - Carregar trailer ao hover

### `geminiApi.js`
Integração com Google Gemini:
- `chamarGemini()` - Chamada core com exponential backoff
- `gerarSinopse()` - Gerar detalhes de filme
- `buscarRecomendacoes()` - Busca inteligente
- `abrirModal()` / `fecharModal()` - Controle de UI

### `index.js`
Inicialização e controller principal:
- Carregamento de dados ao iniciar
- Event listeners globais
- Controle de fluxo da aplicação

---

## 🔧 Configuração da API Gemini

Para usar a funcionalidade de IA, você precisa:

1. Ir para [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Gerar uma API Key
3. No arquivo `js/geminiApi.js`, adicionar sua chave:

```javascript
const IA = {
    apiKey: "sua-chave-aqui",
    // ...
}
```

---

## 📱 Responsividade

A aplicação é totalmente responsiva com breakpoints para:
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px
- **Desktop:** 1024px+

Recursos:
- Menu hamburger em mobile
- Carrosséis adaptáveis
- Fonte dinâmica
- Padding e margin ajustados

---

## 🎓 Aprendizados da Alura

Este projeto foi desenvolvido seguindo os ensinamentos da **Alura** em:
- ✅ HTML5 Semântico
- ✅ CSS3 Moderno (Flexbox, Grid, Animações)
- ✅ JavaScript Vanilla (DOM, Eventos, Async/Await)
- ✅ Integração com APIs externas
- ✅ Responsividade e Mobile First
- ✅ Boas práticas de desenvolvimento

Com personalização e expansão para:
- 🔄 Gerenciamento avançado de estado
- 🤖 Integração de IA (Google Gemini)
- 🎬 Simulação realista de streaming
- 📊 Estrutura escalável

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais. Todos os assets externos (imagens, vídeos) respeitam suas respectivas licenças.

---

Feito com 💙 e código por mim e graças a Alura