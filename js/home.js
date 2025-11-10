let itensDestaque = [];
let slideAtual = 0;
let timerDestaque;

function carregarTudo() {
    carregarDestaque();
    preencherFileira('movie/popular', 'fileira-populares');
    preencherFileira('movie/upcoming', 'fileira-lancamentos');
    preencherFileira('movie/top_rated', 'fileira-recomendados');
    preencherFileira('tv/popular', 'fileira-series');
    preencherFileira('discover/movie?with_genres=16', 'fileira-animacao');
    preencherFileira('discover/movie?with_genres=28', 'fileira-acao');
    preencherFileira('discover/movie?with_genres=18', 'fileira-drama');
}

async function preencherFileira(endpoint, idContainer) {
    const separador = endpoint.includes('?') ? '&' : '?';
    const url = `${URL_BASE_API}/${endpoint}${separador}api_key=${CHAVE_API}&language=pt-BR`;
    const container = document.getElementById(idContainer);

    if (!container) return;

    let tipo = 'movie';
    if (endpoint.startsWith('tv')) {
        tipo = 'tv';
    }

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        const itens = dados.results;

        container.innerHTML = '';

        itens.forEach(item => {
            if (!item.poster_path) return;

            const id = item.id;
            const titulo = item.title || item.name;

            const link = document.createElement('a');
            link.href = `detalhes.html?id=${id}&type=${tipo}`; 

            const card = document.createElement('div');
            card.classList.add('card-filme');

            const posterUrl = `${URL_IMAGEM}${item.poster_path}`;
            card.innerHTML = `<img src="${posterUrl}" alt="${titulo}" class="poster">`;

            link.appendChild(card);
            container.appendChild(link);
        });

    } catch (erro) {
        console.error(`Erro ao buscar fileira ${idContainer}:`, erro);
    }
}

async function carregarDestaque() {
    const url = `${URL_BASE_API}/movie/popular?api_key=${CHAVE_API}&language=pt-BR`;
    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        itensDestaque = dados.results.slice(0, 5);
        if (itensDestaque.length === 0) return;

        iniciarControlesDestaque();
        mudarSlideDestaque(0);
        reiniciarTimerDestaque();
    } catch (erro) {
        console.error('Erro ao buscar destaque:', erro);
    }
}

async function mudarSlideDestaque(novoIndex) {
    const imgFundo = document.getElementById('img-fundo-destaque');
    const infos = document.querySelector('.infos-destaque');

    if (imgFundo) imgFundo.classList.add('hero-fading');
    if (infos) infos.classList.add('hero-fading');

    await new Promise(resolve => setTimeout(resolve, 400));

    const item = itensDestaque[novoIndex];
    if (!item) return;

    const detalhes = await buscarDetalhesItem(item);

    mostrarDestaque(item, detalhes);
    atualizarBolinhas(novoIndex);
    slideAtual = novoIndex;

    if (imgFundo) imgFundo.classList.remove('hero-fading');
    if (infos) infos.classList.remove('hero-fading');
}

function iniciarControlesDestaque() {
    const btnEsquerda = document.getElementById('seta-destaque-esquerda');
    const btnDireita = document.getElementById('seta-destaque-direita');
    
    if (btnDireita) btnDireita.addEventListener('click', () => trocarSlide('proximo'));
    if (btnEsquerda) btnEsquerda.addEventListener('click', () => trocarSlide('anterior'));

    const bolinhas = document.querySelectorAll('.bolinha');
    bolinhas.forEach((bolinha, index) => {
        bolinha.addEventListener('click', () => {
            if (index !== slideAtual) {
                reiniciarTimerDestaque();
                mudarSlideDestaque(index);
            }
        });
    });
}

function iniciarTimerDestaque() {
    clearInterval(timerDestaque);
    timerDestaque = setInterval(() => {
        trocarSlide('proximo');
    }, 7000);
}

function reiniciarTimerDestaque() {
    clearInterval(timerDestaque);
    iniciarTimerDestaque();
}

function trocarSlide(direcao) {
    let novoIndex = slideAtual;
    if (direcao === 'proximo') {
        novoIndex++;
        if (novoIndex >= itensDestaque.length) novoIndex = 0;
    } else {
        novoIndex--;
        if (novoIndex < 0) novoIndex = itensDestaque.length - 1;
    }
    mudarSlideDestaque(novoIndex);
}

async function buscarDetalhesItem(item) {
    try {
        const url = `${URL_BASE_API}/movie/${item.id}?api_key=${CHAVE_API}&language=pt-BR&append_to_response=images`;
        const resposta = await fetch(url);
        return await resposta.json();
    } catch (erro) {
        console.error('Erro ao buscar detalhes do item:', erro);
        return null;
    }
}

function mostrarDestaque(item, detalhes) {
    if (!item || !detalhes) return;

    const imgFundo = document.getElementById('img-fundo-destaque');
    const tituloEl = document.getElementById('titulo-destaque');
    const logoEl = document.getElementById('logo-destaque');
    const descricaoEl = document.getElementById('descricao-destaque');
    const btnInfos = document.getElementById('botao-infos-destaque');
    const btnAssistir = document.getElementById('botao-assistir-destaque');
    
    const titulo = item.title || item.name;
    const descricao = item.overview;
    const fundoUrl = `${URL_FUNDO}${item.backdrop_path}`;

    if (imgFundo) {
        imgFundo.src = fundoUrl;
        imgFundo.alt = titulo;
    }

    if (descricaoEl) {
        const palavras = descricao.split(' ');
        const resumo = palavras.slice(0, 30).join(' ') + '...';
        descricaoEl.textContent = resumo;
    }

    let logoPath = null;
    if (detalhes.images?.logos?.length > 0) {
        let logo = detalhes.images.logos.find(l => l.iso_639_1 === 'pt' || l.iso_639_1 === 'en') || detalhes.images.logos[0];
        if (logo) logoPath = logo.file_path;
    }

    if (logoPath && logoEl) {
        logoEl.src = `${URL_LOGO}${logoPath}`;
        logoEl.alt = `${titulo} logo`;
        logoEl.style.display = 'block';
        if (tituloEl) tituloEl.style.display = 'none';
    } else {
        if (tituloEl) {
            tituloEl.textContent = titulo;
            tituloEl.style.display = 'block';
        }
        if (logoEl) logoEl.style.display = 'none';
    }

    if (btnInfos) {
        const novoBtnInfos = btnInfos.cloneNode(true);
        btnInfos.parentNode.replaceChild(novoBtnInfos, btnInfos);
        novoBtnInfos.addEventListener('click', () => {
            window.location.href = `detalhes.html?id=${item.id}&type=movie`;
        });
    }

    if (btnAssistir) {
        const novoBtnAssistir = btnAssistir.cloneNode(true);
        btnAssistir.parentNode.replaceChild(novoBtnAssistir, btnAssistir);
        novoBtnAssistir.addEventListener('click', () => {
            alert('Player indisponível.');
        });
    }
}

function atualizarBolinhas(index) {
    const bolinhas = document.querySelectorAll('.bolinha');
    bolinhas.forEach((bolinha, i) => {
        if (i === index) {
            bolinha.classList.add('ativo');
        } else {
            bolinha.classList.remove('ativo');
        }
    });
}

function iniciarCarrosseis() {
    const todosCarrosseis = document.querySelectorAll('.trilho-wrapper');
    todosCarrosseis.forEach(wrapper => {
        const container = wrapper.querySelector('.trilho-container');
        const btnEsquerda = wrapper.querySelector('.seta-fileira.esquerda');
        const btnDireita = wrapper.querySelector('.seta-fileira.direita');

        if (!container || !btnEsquerda || !btnDireita) return;

        btnDireita.addEventListener('click', () => {
            const scrollValor = container.clientWidth;
            if (container.scrollLeft + scrollValor >= container.scrollWidth - 1) {
                container.scrollLeft = 0;
            } else {
                container.scrollLeft += scrollValor;
            }
        });

        btnEsquerda.addEventListener('click', () => {
            const scrollValor = container.clientWidth;
            if (container.scrollLeft === 0) {
                container.scrollLeft = container.scrollWidth;
            } else {
                container.scrollLeft -= scrollValor;
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    iniciarCarrosseis();
    carregarTudo();
});

window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
        carregarTudo();
    }
});