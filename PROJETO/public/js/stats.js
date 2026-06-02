const eventsData = JSON.parse(localStorage.getItem('agendaEvents')) || {};

function initStatsPage() {
    loadProfileHeader();
    calculateAdvancedStatistics();
}

function loadProfileHeader() {
    const savedName = localStorage.getItem('profileName') || "Usuário Comum";
    const savedRole = localStorage.getItem('profileRole') || "Minha Agenda";
    
    document.getElementById('profile-name-display').textContent = savedName;
    document.getElementById('profile-role-display').textContent = savedRole;
    document.getElementById('profile-avatar').textContent = savedName.charAt(0).toUpperCase();
}

function calculateAdvancedStatistics() {
    let total = 0;
    let completed = 0;
    let withExamsPending = 0;
    let weeklyDistribution = [0, 0, 0, 0, 0, 0, 0];
    let recentlyDone = [];

    Object.keys(eventsData).forEach(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        const dayOfWeek = eventDate.getDay();

        eventsData[dateKey].forEach(ev => {
            total++;
            
            if (ev.status === 'realizada') {
                completed++;
                weeklyDistribution[dayOfWeek]++;
                
                recentlyDone.push({
                    title: ev.title,
                    date: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`,
                    time: ev.time
                });
            }
            
            if (ev.pending) {
                withExamsPending++;
            }
        });
    });

    document.getElementById('total-tasks').textContent = total;
    document.getElementById('done-tasks').textContent = completed;
    document.getElementById('pending-exams').textContent = withExamsPending;

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    document.getElementById('stats-progress-fill').style.width = `${percentage}%`;
    document.getElementById('stats-progress-percent').textContent = `${percentage}%`;

    const msgEl = document.getElementById('efficiency-msg');
    if (percentage === 100 && total > 0) msgEl.textContent = "Excelente! Todas as metas foram concluídas.";
    else if (percentage >= 70) msgEl.textContent = "Ótimo ritmo! Suas tarefas estão em dia.";
    else if (percentage >= 40) msgEl.textContent = "Bom progresso. Continue avançando.";
    else if (total === 0) msgEl.textContent = "Nenhum dado registrado na agenda ainda.";
    else msgEl.textContent = "Atenção às tarefas pendentes.";

    const maxTasksInADay = Math.max(...weeklyDistribution, 1);
    const barIds = ['bar-dom', 'bar-seg', 'bar-ter', 'bar-qua', 'bar-qui', 'bar-sex', 'bar-sab'];
    
    barIds.forEach((id, index) => {
        const tasksOnDay = weeklyDistribution[index];
        const barHeightPercentage = total > 0 ? (tasksOnDay / maxTasksInADay) * 100 : 0;
        
        const barElement = document.getElementById(id);
        if (barElement) {
            barElement.style.height = `${barHeightPercentage}%`;
            barElement.title = `${tasksOnDay} concluída(s)`;
        }
    });

    const recentListEl = document.getElementById('recent-done-list');
    recentListEl.innerHTML = '';

    if (recentlyDone.length === 0) {
        recentListEl.innerHTML = `<li style="color: var(--text-muted); text-align: center; padding: 15px;">Nenhuma atividade concluída recentemente.</li>`;
        return;
    }

    recentlyDone.slice(-3).reverse().forEach(item => {
        const li = document.createElement('li');
        li.classList.add('recent-item');
        li.innerHTML = `
            <div class="recent-item-info">
                <span class="recent-badge-done">CONCLUÍDO</span>
                <strong>${item.title}</strong>
            </div>
            <span style="color: var(--text-muted); font-size: 0.8rem;">${item.date} às ${item.time}</span>
        `;
        recentListEl.appendChild(li);
    });
}

window.onload = initStatsPage;