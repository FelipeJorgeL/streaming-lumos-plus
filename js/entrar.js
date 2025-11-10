document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            window.location.href = 'escolher-perfil.html';
        });
    }
});