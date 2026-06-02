function initSettingsPage() {
    loadCurrentSettings();
    setupEventListeners();
}

function loadCurrentSettings() {
    const savedName = localStorage.getItem('profileName') || "Usuário Comum";
    const savedRole = localStorage.getItem('profileRole') || "Minha Agenda";
    
    document.getElementById('profile-name-display').textContent = savedName;
    document.getElementById('profile-role-display').textContent = savedRole;
    document.getElementById('profile-avatar').textContent = savedName.charAt(0).toUpperCase();

    document.getElementById('user-name-input').value = savedName;
    document.getElementById('user-role-input').value = savedRole;
}

function setupEventListeners() {
    const form = document.getElementById('settings-form');
    const clearBtn = document.getElementById('clear-data-btn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newName = document.getElementById('user-name-input').value.trim();
        const newRole = document.getElementById('user-role-input').value.trim();

        localStorage.setItem('profileName', newName);
        localStorage.setItem('profileRole', newRole);
        
        loadCurrentSettings();
        alert('Perfil atualizado com sucesso! Alterações aplicadas em todo o painel.');
    });

    clearBtn.addEventListener('click', () => {
        const firstConfirmation = confirm('Tem certeza que deseja apagar TODOS os seus compromissos e tarefas?');
        
        if (firstConfirmation) {
            const secondConfirmation = confirm('Esta ação não poderá ser desfeita. Deseja mesmo continuar?');
            
            if (secondConfirmation) {
                localStorage.removeItem('agendaEvents');
                alert('O banco de dados de compromissos foi resetado.');
            }
        }
    });
}

window.onload = initSettingsPage;