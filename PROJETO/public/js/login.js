document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/usuario/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro || 'E-mail ou senha incorretos.');
            return;
        }

        // RdN6: armazena token JWT junto com os dados do usuário
        sessionStorage.setItem('userAuthenticated', 'true');
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        window.location.href = '/home';

    } catch (err) {
        alert('Erro de conexao com o servidor. Verifique se o servidor esta rodando na porta 3000.');
        console.error(err);
    }
});
