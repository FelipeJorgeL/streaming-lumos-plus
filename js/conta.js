document.addEventListener('DOMContentLoaded', () => {
    const infosPerfis = {
        'felipe': {
            nome: 'Felipe',
            email: 'felipe@lumos.com',
            img: 'assets/images/walter.png',
            sobreMimUrl: 'https://github.com/FelipeJorgeL'
        },
        'guilherme': {
            nome: 'Guilherme',
            email: 'guilherme@lumos.com',
            img: 'assets/images/jesse.png',
            sobreMimUrl: 'https://github.com/GuilhermeAgra'
        }
    };

    const nomePerfilAtivo = localStorage.getItem('perfilAtivoNome') || 'felipe';
    const perfilAtual = infosPerfis[nomePerfilAtivo];

    const fotoPagina = document.getElementById('foto-perfil-pagina');
    const nomePagina = document.getElementById('nome-perfil-pagina');
    const emailPagina = document.getElementById('email-perfil-pagina');
    const linkSobreMim = document.getElementById('link-sobre-mim');

    if (perfilAtual) {
        if (fotoPagina) fotoPagina.src = perfilAtual.img;
        if (nomePagina) nomePagina.textContent = perfilAtual.nome;
        if (emailPagina) emailPagina.textContent = `Email: ${perfilAtual.email}`;
        if (linkSobreMim) linkSobreMim.href = perfilAtual.sobreMimUrl;
    }
});