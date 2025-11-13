document.addEventListener('DOMContentLoaded', () => {
    
    let idItem = null;
    let tipoMidia = null;

    function iniciarAbas() {
        const linksAba = document.querySelectorAll('.link-aba');
        const paineisAba = document.querySelectorAll('.painel-aba');
        
        linksAba.forEach(aba => {
            aba.addEventListener('click', (e) => {
                e.preventDefault();
                const idAlvo = aba.dataset.aba;
                
                linksAba.forEach(t => t.classList.remove('ativo'));
                paineisAba.forEach(p => p.classList.remove('ativo'));
                
                aba.classList.add('ativo');
                const painelAtivo = document.getElementById(`painel-${idAlvo}`);
                if (painelAtivo) {
                    painelAtivo.classList.add('ativo');
                }
            });
        });
    }

    function pegarInfoDaUrl() {
        const params = new URLSearchParams(window.location.search);
        idItem = params.get('id');
        tipoMidia = params.get('type');
        if (!idItem || !tipoMidia) {
            console.error('ID ou Tipo não encontrado na URL');
        }
    }

    async function buscarDetalhes() {
        if (!idItem || !tipoMidia) return;
    
        let complementos = 'images,credits';
        if (tipoMidia === 'movie') {
            complementos += ',release_dates';
        } else if (tipoMidia === 'tv') {
            complementos += ',content_ratings';
        }
        
        const url = `${URL_BASE_API}/${tipoMidia}/${idItem}?api_key=${CHAVE_API}&language=pt-BR&append_to_response=${complementos}`;
    
        try {
            const resposta = await fetch(url);
            const item = await resposta.json();
    
            mostrarDestaque(item);
            mostrarDetalhesAba(item);
            buscarSugestoes();
    
        } catch (erro) {
            console.error('Erro ao buscar detalhes:', erro);
        }
    }

    function mostrarDestaque(item) {
        const titulo = item.title || item.name;
        const dataLancamento = item.release_date || item.first_air_date;

        document.title = `${titulo} | Lumos+`;

        const fundo = document.getElementById('img-fundo-detalhes');
        const tituloEl = document.getElementById('titulo-detalhes');
        const logoEl = document.getElementById('logo-filme');
        const infosMetaEl = document.getElementById('infos-meta');
        const descricaoEl = document.getElementById('descricao-hero-detalhes');
        const botaoAssistir = document.getElementById('botao-assistir');

        if (fundo) {
            fundo.src = `${URL_FUNDO}${item.backdrop_path}`;
            fundo.alt = titulo;
        }

        if (descricaoEl && item.overview) {
            const palavras = item.overview.split(' ');
            const resumo = palavras.slice(0, 30).join(' ') + '...';
            descricaoEl.textContent = resumo;
        }

        let logoPath = null;
        if (item.images?.logos?.length > 0) {
            let logo = item.images.logos.find(l => l.iso_639_1 === 'pt' || l.iso_639_1 === 'en');
            if (logo) logoPath = logo.file_path;
        }

        if (logoPath && logoEl) {
            logoEl.src = `${URL_LOGO}${logoPath}`;
            logoEl.style.display = 'block';
            if (tituloEl) tituloEl.style.display = 'none';
        } else if (tituloEl) {
            tituloEl.textContent = titulo;
            tituloEl.style.display = 'block';
            if (logoEl) logoEl.style.display = 'none';
        }

        if (infosMetaEl) {
            infosMetaEl.innerHTML = '';
            if (dataLancamento) {
                const ano = dataLancamento.split('-')[0];
                infosMetaEl.appendChild(criarInfo(ano));
            }
            const duracao = item.runtime || (item.episode_run_time ? item.episode_run_time[0] : null);
            if (duracao) {
                infosMetaEl.appendChild(criarInfo(formatarTempo(duracao)));
            }
            const classificacao = pegarClassificacao(item);
            if (classificacao) {
                infosMetaEl.appendChild(criarInfo(classificacao));
            }
        }

        if (botaoAssistir) {
            botaoAssistir.addEventListener('click', () => {
                alert('Player indisponível no momento.');
            });
        }
    }

    function mostrarDetalhesAba(item) {
        const titulo = item.title || item.name;
        const dataLancamento = item.release_date || item.first_air_date;

        const tituloSinopse = document.getElementById('titulo-sinopse');
        const resumo = document.getElementById('resumo-detalhes');
        const infoDuracao = document.getElementById('info-duracao');
        const infoLancamento = document.getElementById('info-lancamento');
        const infoGenero = document.getElementById('info-genero');
        const infoClassificacao = document.getElementById('info-classificacao');
        const infoDirecao = document.getElementById('info-direcao');
        const infoElenco = document.getElementById('info-elenco');
        const infoAudio = document.getElementById('info-audio');
        const infoFormatos = document.getElementById('info-formatos');

        if (tituloSinopse) tituloSinopse.textContent = titulo;
        if (resumo) resumo.textContent = item.overview;

        if (infoDuracao) {
            let duracaoTexto = 'N/A';
            if (tipoMidia === 'movie' && item.runtime) {
                duracaoTexto = formatarTempo(item.runtime);
            } else if (tipoMidia === 'tv' && item.number_of_seasons) {
                duracaoTexto = `${item.number_of_seasons} Temporada(s)`;
            }
            infoDuracao.innerHTML = `<strong>Duração:</strong><span>${duracaoTexto}</span>`;
        }

        if (infoLancamento && dataLancamento) {
            const dataFormatada = new Date(dataLancamento).toLocaleDateString('pt-BR', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            infoLancamento.innerHTML = `<strong>Data de lançamento:</strong><span>${dataFormatada}</span>`;
        }

        if (infoGenero) {
            const generos = item.genres.map(g => g.name).join(', ');
            infoGenero.innerHTML = `<strong>Gênero:</strong><span>${generos}</span>`;
        }

        const classificacao = pegarClassificacao(item);
        if (infoClassificacao) {
            infoClassificacao.innerHTML = `<strong>Classificação:</strong><span>${classificacao || 'Não classificado'}</span>`;
        }
        
        if (infoDirecao) {
            let responsavel = null;
            let cargo = 'Direção';
            if (tipoMidia === 'movie') {
                responsavel = item.credits.crew.find(c => c.job === 'Director');
            } else if (tipoMidia === 'tv' && item.created_by?.length > 0) {
                responsavel = item.created_by[0];
                cargo = 'Criador(a)';
            }
            infoDirecao.innerHTML = `<strong>${cargo}:</strong><span>${responsavel ? responsavel.name : 'N/A'}</span>`;
        }

        if (infoElenco && item.credits.cast) {
            const elenco = item.credits.cast.slice(0, 5).map(ator => ator.name).join('<br>');
            infoElenco.innerHTML = `<strong>Elenco:</strong><span>${elenco}</span>`;
        }

        if (infoAudio) infoAudio.innerHTML = `<strong>Áudio:</strong><span>Português (Brasil), Inglês</span>`;
        if (infoFormatos) infoFormatos.innerHTML = `<strong>Disponível nos formatos:</strong><span>4K Ultra HD, Dolby Vision, HDR10</span>`;
    }

    async function buscarSugestoes() {
        if (!idItem || !tipoMidia) return;
        const url = `${URL_BASE_API}/${tipoMidia}/${idItem}/recommendations?api_key=${CHAVE_API}&language=pt-BR`;
        const container = document.getElementById('trilho-sugestoes');
        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();
            mostrarSugestoes(dados.results, container);
        } catch (erro) {
            console.error('Erro ao buscar sugestões:', erro);
        }
    }

    function mostrarSugestoes(itens, container) {
        if (!container) return;
        container.innerHTML = '';
        itens.forEach(item => {
            if (!item.poster_path) return;
            
            const novoTipo = item.media_type || tipoMidia;
            const titulo = item.title || item.name;

            const link = document.createElement('a');
            link.href = `detalhes.html?id=${item.id}&type=${novoTipo}`; 
            
            const card = document.createElement('div');
            card.classList.add('card-filme');
            const posterUrl = `${URL_IMAGEM}${item.poster_path}`;
            card.innerHTML = `<img src="${posterUrl}" alt="${titulo}" class="poster">`;
            
            link.appendChild(card);
            container.appendChild(link);
        });
    }

    function criarInfo(texto) {
        const item = document.createElement('span');
        item.classList.add('info-item');
        item.textContent = texto;
        return item;
    }

    function formatarTempo(runtime) {
        if (!runtime) return 'N/A';
        const horas = Math.floor(runtime / 60);
        const minutos = runtime % 60;
        return `${horas}h ${minutos}min`;
    }

    function pegarClassificacao(item) {
        try {
            if (item.release_dates?.results) {
                const br = item.release_dates.results.find(r => r.iso_3166_1 === 'BR');
                if (br && br.release_dates[0].certification) return br.release_dates[0].certification;
                const us = item.release_dates.results.find(r => r.iso_3166_1 === 'US');
                if (us && us.release_dates[0].certification) return us.release_dates[0].certification;
            }
        } catch (e) {}
    
        try {
            if (item.content_ratings?.results) {
                const br = item.content_ratings.results.find(r => r.iso_3166_1 === 'BR');
                if (br && br.rating) return br.rating;
                const us = item.content_ratings.results.find(r => r.iso_3166_1 === 'US');
                if (us && us.rating) return us.rating;
            }
        } catch (e) {}
        
        return null;
    }

    function iniciarCarrosselSugestoes() {
        const wrapper = document.querySelector('#painel-sugestoes .trilho-wrapper');
        if (!wrapper) return;
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
    }

    iniciarAbas();
    pegarInfoDaUrl();
    buscarDetalhes();
    iniciarCarrosselSugestoes();
});