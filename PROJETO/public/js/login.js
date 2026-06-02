document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('login-email').value.trim();
    const passwordInput = document.getElementById('login-password').value;

    // Puxa as credenciais gravadas no momento do cadastro
    const registeredEmail = localStorage.getItem('profileEmail');
    const registeredPassword = localStorage.getItem('profilePassword');

    // Validação simulada baseada nos dados locais
    if (!registeredEmail) {
        alert('Nenhuma conta encontrada neste navegador. Por favor, faça o cadastro primeiro.');
        window.location.href = 'cadastro.html';
        return;
    }

    if (emailInput === registeredEmail && passwordInput === registeredPassword) {
        // Define que o usuário está autenticado na sessão atual
        sessionStorage.setItem('userAuthenticated', 'true');
        
        // Redireciona para o painel do calendário
        window.location.href = 'home.html';
    } else {
        alert('E-mail ou senha incorretos. Tente novamente.');
    }
});