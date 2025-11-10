document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('form-cadastro');

    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Cadastro realizado! Redirecionando para o login.');
            window.location.href = 'index.html';
        });
    }
});