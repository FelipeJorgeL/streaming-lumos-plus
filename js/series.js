document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.getElementById('grid-resultados');
    const tagsGenero = document.querySelectorAll('.tag-genero');

    async function buscarSeries(idGenero = 'all') {
        let urlBase;
        if (idGenero === 'all') {
            urlBase = `${URL_BASE_API}/tv/popular?api_key=${CHAVE_API}&language=pt-BR`;
        } else {
            urlBase = `${URL_BASE_API}/discover/tv?api_key=${CHAVE_API}&with_genres=${idGenero}&language=pt-BR&sort_by=popularity.desc`;
        }
        
        if (!grid) return;
        grid.innerHTML = '<p style="color: var(--texto-medio); font-size: 1.2em;">Carregando séries...</p>';

        try {
            const promessaPag1 = fetch(`${urlBase}&page=1`).then(res => res.json());
            const promessaPag2 = fetch(`${urlBase}&page=2`).then(res => res.json());
            const promessaPag3 = fetch(`${urlBase}&page=3`).then(res => res.json());

            const [pag1, pag2, pag3] = await Promise.all([promessaPag1, promessaPag2, promessaPag3]);

            let todasAsSeries = [];
            if (pag1?.results) todasAsSeries = todasAsSeries.concat(pag1.results);
            if (pag2?.results) todasAsSeries = todasAsSeries.concat(pag2.results);
            if (pag3?.results) todasAsSeries = todasAsSeries.concat(pag3.results.slice(0, 16)); 

            mostrarResultados(todasAsSeries);

        } catch (erro) {
            console.error('Erro ao buscar séries:', erro);
            grid.innerHTML = '<p>Erro ao carregar séries.</p>';
        }
    }

    function mostrarResultados(series) {
        if (!grid) return;
        grid.innerHTML = '';

        if (series.length === 0) {
            grid.innerHTML = '<p>Nenhuma série encontrada.</p>';
            return;
        }

        series.forEach(serie => {
            if (!serie.poster_path) return;

            const link = document.createElement('a');
            link.href = `detalhes.html?id=${serie.id}&type=tv`;

            const card = document.createElement('div');
            card.classList.add('card-filme');

            const posterUrl = `${URL_IMAGEM}${serie.poster_path}`;
            card.innerHTML = `<img src="${posterUrl}" alt="${serie.name}" class="poster">`;

            link.appendChild(card);
            grid.appendChild(link);
        });
    }

    function iniciarFiltros() {
        tagsGenero.forEach(tag => {
            tag.addEventListener('click', () => {
                tagsGenero.forEach(t => t.classList.remove('ativo'));
                tag.classList.add('ativo');
                const idGenero = tag.dataset.idGenero;
                buscarSeries(idGenero);
            });
        });
    }

    iniciarFiltros();
    buscarSeries('all');
});