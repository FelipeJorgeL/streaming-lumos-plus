document.addEventListener('DOMContentLoaded', () => {
    
    const fotoPerfilSalva = localStorage.getItem('perfilAtivoImg');
    if (fotoPerfilSalva) {
        const iconeHeader = document.getElementById('icone-perfil-header');
        if (iconeHeader) {
            iconeHeader.innerHTML = '';
            const imgDoPerfil = document.createElement('img');
            imgDoPerfil.src = fotoPerfilSalva;
            imgDoPerfil.alt = 'Perfil';
            iconeHeader.appendChild(imgDoPerfil);
        }
    }

    const caixaBusca = document.getElementById('caixa-busca');
    const inputBusca = document.getElementById('input-busca');
    const botaoBusca = document.getElementById('botao-busca');

    if (caixaBusca && inputBusca && botaoBusca) {
        
        botaoBusca.addEventListener('click', (e) => {
            if (caixaBusca.classList.contains('ativo')) {
                if (inputBusca.value.trim() === '') {
                    e.preventDefault(); 
                    caixaBusca.classList.remove('ativo');
                }
            } else {
                e.preventDefault(); 
                caixaBusca.classList.add('ativo');
                inputBusca.focus();
            }
        });

        caixaBusca.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const query = inputBusca.value.trim();
            if (query) {
                window.location.href = `pesquisa.html?query=${encodeURIComponent(query)}`;
            }
        });

        document.addEventListener('click', (e) => {
            if (!caixaBusca.contains(e.target) && inputBusca.value.trim() === '') {
                caixaBusca.classList.remove('ativo');
            }
        });
    }

    const barraTopo = document.querySelector('.barra-topo');
    if (barraTopo && window.location.pathname.includes('home.html') || window.location.pathname.includes('detalhes.html')) {
        
        if (window.scrollY > 50) {
            barraTopo.classList.add('header-scroll');
        } else {
            barraTopo.classList.remove('header-scroll');
        }

        const handleScroll = () => {
            if (window.scrollY > 50) {
                barraTopo.classList.add('header-scroll');
            } else {
                barraTopo.classList.remove('header-scroll');
            }
        };
        window.addEventListener('scroll', handleScroll);
    } else if (barraTopo) {
        barraTopo.classList.add('header-fixo');
    }
});