document.addEventListener('DOMContentLoaded', () => {

    const tituloPagina = document.getElementById('titulo-pesquisa');
    const grid = document.getElementById('grid-resultados');

    function pegarBuscaDaUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('query');
    }

    async function buscarResultados(busca) {
        if (!grid) return;
        if (!busca) {
            if (tituloPagina) tituloPagina.textContent = 'Por favor, digite um termo de busca.';
            return;
        }

        if (tituloPagina) tituloPagina.textContent = `Resultados para "${busca}"`;
        grid.innerHTML = '<p style="color: var(--texto-medio); font-size: 1.2em;">Buscando...</p>';
        
        const url = `${URL_BASE_API}/search/multi?api_key=${CHAVE_API}&query=${encodeURIComponent(busca)}&language=pt-BR`;

        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();
            
            const itensFiltrados = dados.results.filter(item => 
                (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path
            );
            
            mostrarResultados(itensFiltrados);

        } catch (erro) {
            console.error('Erro ao buscar resultados:', erro);
            if (tituloPagina) tituloPagina.textContent = 'Erro ao carregar resultados.';
        }
    }

    function mostrarResultados(itens) {
        if (!grid) return;
        grid.innerHTML = '';

        if (itens.length === 0) {
            if (tituloPagina) tituloPagina.textContent = `Nenhum resultado encontrado para "${pegarBuscaDaUrl()}"`;
            return;
        }

        itens.forEach(item => {
            const tipo = item.media_type;
            const titulo = item.title || item.name;

            const link = document.createElement('a');
            link.href = `detalhes.html?id=${item.id}&type=${tipo}`;

            const card = document.createElement('div');
            card.classList.add('card-filme');

            const posterUrl = `${URL_IMAGEM}${item.poster_path}`;
            card.innerHTML = `<img src="${posterUrl}" alt="${titulo}" class="poster">`;

            link.appendChild(card);
            grid.appendChild(link);
        });
    }

    const busca = pegarBuscaDaUrl();
    buscarResultados(busca);
});