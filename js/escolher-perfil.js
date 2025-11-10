document.addEventListener('DOMContentLoaded', () => {
   const perfis = document.querySelectorAll('.card-perfil');

    perfis.forEach(perfil => {
        perfil.addEventListener('click', () => {
            const nomePerfil = perfil.dataset.nome; 
            const imgUrl = perfil.querySelector('.imagem-perfil').src;

            localStorage.setItem('perfilAtivoNome', nomePerfil);
            localStorage.setItem('perfilAtivoImg', imgUrl);
            
            window.location.href = 'home.html';
        });
    });
});