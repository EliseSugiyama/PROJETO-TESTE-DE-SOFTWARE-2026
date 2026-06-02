document.getElementById('cadastro-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('reg-name').value.trim();
    const emailInput = document.getElementById('reg-email').value.trim();
    const passwordInput = document.getElementById('reg-password').value;

    if (nameInput && emailInput && passwordInput) {
        // Guarda as informações básicas e de segurança simulada
        localStorage.setItem('profileName', nameInput);
        localStorage.setItem('profileEmail', emailInput);
        localStorage.setItem('profilePassword', passwordInput)
        
        // Em um sistema real com backend, o e-mail substituiria o subtítulo padrão
        localStorage.setItem('profileRole', emailInput); 
        
        localStorage.setItem('userRegistered', 'true');

        // Redireciona para a tela principal
        window.location.href = 'index.html';
    } else {
        alert('Por favor, preencha todos os campos obrigatórios.');
    }
});
