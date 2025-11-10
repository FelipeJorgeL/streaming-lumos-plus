// js/filmes.js
document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.getElementById('grid-resultados');
    const tagsGenero = document.querySelectorAll('.tag-genero');

    async function buscarFilmes(idGenero = 'all') {
        let baseUrl;
        if (idGenero === 'all') {
            baseUrl = `${URL_BASE_API}/movie/popular?api_key=${CHAVE_API}&language=pt-BR`;
        } else {
            baseUrl = `${URL_BASE_API}/discover/movie?api_key=${CHAVE_API}&with_genres=${idGenero}&language=pt-BR&sort_by=popularity.desc`;
        }
        
        if (!grid) return;
        grid.innerHTML = '<p style="color: var(--texto-medio); font-size: 1.2em;">Carregando filmes...</p>';

        try {
            const promessaPag1 = fetch(`${baseUrl}&page=1`).then(res => res.json());
            const promessaPag2 = fetch(`${baseUrl}&page=2`).then(res => res.json());
            const promessaPag3 = fetch(`${baseUrl}&page=3`).then(res => res.json());

            const [pag1, pag2, pag3] = await Promise.all([promessaPag1, promessaPag2, promessaPag3]);

            let todosOsFilmes = [];
            if (pag1?.results) todosOsFilmes = todosOsFilmes.concat(pag1.results);
            if (pag2?.results) todosOsFilmes = todosOsFilmes.concat(pag2.results);
            if (pag3?.results) todosOsFilmes = todosOsFilmes.concat(pag3.results.slice(0, 16)); 

            mostrarResultados(todosOsFilmes);

        } catch (erro) {
            console.error('Erro ao buscar filmes:', erro);
            grid.innerHTML = '<p>Erro ao carregar filmes.</p>';
        }
    }

    function mostrarResultados(filmes) {
        if (!grid) return;
        grid.innerHTML = '';

        if (filmes.length === 0) {
            grid.innerHTML = '<p>Nenhum filme encontrado.</p>';
            return;
        }

        filmes.forEach(filme => {
            if (!filme.poster_path) return;

            const link = document.createElement('a');
            link.href = `detalhes.html?id=${filme.id}&type=movie`;

            const card = document.createElement('div');
            card.classList.add('card-filme');

            const posterUrl = `${URL_IMAGEM}${filme.poster_path}`;
            card.innerHTML = `<img src="${posterUrl}" alt="${filme.title}" class="poster">`;

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
                buscarFilmes(idGenero);
            });
        });
    }

    iniciarFiltros();
    buscarFilmes('all');
});