document.getElementById('cadastro-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome  = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const senha = document.getElementById('reg-password').value;

    if (!nome || !email || !senha) {
        alert('Preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('/api/usuario/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro || 'Erro ao cadastrar.');
            return;
        }

        alert('Conta criada com sucesso! Faca login para continuar.');
        window.location.href = '/';

    } catch (err) {
        alert('Erro de conexao com o servidor.');
        console.error(err);
    }
});
