const usuarioSalvo = sessionStorage.getItem('usuario');
if (!sessionStorage.getItem('userAuthenticated') || !usuarioSalvo) {
    window.location.href = '/';
}
const usuario = JSON.parse(usuarioSalvo);

function initSettingsPage() {
    loadCurrentSettings();
    setupEventListeners();
}

function loadCurrentSettings() {
    const nome      = usuario.nome || '';
    const subtitulo = usuario.funcao_subtitulo || 'FamilyCare';
    document.getElementById('profile-name-display').textContent = nome || 'Usuario';
    document.getElementById('profile-role-display').textContent = subtitulo;
    document.getElementById('profile-avatar').textContent       = (nome || 'F').charAt(0).toUpperCase();
    document.getElementById('user-name-input').value  = nome;
    document.getElementById('user-role-input').value  = subtitulo;
}

function setupEventListeners() {
    document.getElementById('settings-form').addEventListener('submit', async e => {
        e.preventDefault();
        const nome            = document.getElementById('user-name-input').value.trim();
        const funcao_subtitulo = document.getElementById('user-role-input').value.trim();

        try {
            const res  = await fetch(`/api/usuario/atualizar/${usuario.id_usuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, funcao_subtitulo })
            });
            const data = await res.json();
            if (!res.ok) { alert(data.erro || 'Erro ao salvar.'); return; }
            usuario.nome = nome;
            usuario.funcao_subtitulo = funcao_subtitulo;
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            loadCurrentSettings();
            alert('Perfil atualizado com sucesso!');
        } catch (err) { alert('Erro ao salvar perfil.'); console.error(err); }
    });

    document.getElementById('clear-data-btn').addEventListener('click', async () => {
        if (!confirm('Apagar TODAS as consultas desta conta?')) return;
        if (!confirm('Esta acao nao pode ser desfeita. Confirma?')) return;
        try {
            const res   = await fetch(`/api/consulta/listar/${usuario.id_usuario}`);
            const lista = await res.json();
            await Promise.all(lista.map(c => fetch(`/api/consulta/${c.id}`, { method: 'DELETE' })));
            alert('Todos os dados da agenda foram apagados.');
        } catch (err) { alert('Erro ao apagar dados.'); console.error(err); }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '/';
    });
}

window.onload = initSettingsPage;
