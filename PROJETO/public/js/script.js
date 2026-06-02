// Gerenciamento de Estado Global
let currentDate = new Date();
let selectedDateStr = formatDateKey(new Date());
let eventsData = JSON.parse(localStorage.getItem('agendaEvents')) || {};

// Elementos do DOM
const monthYearDisplay = document.getElementById('month-year-display');
const calendarGrid = document.getElementById('calendar-grid');
const appointmentsList = document.getElementById('appointments-list');
const selectedDateTitle = document.getElementById('selected-date-title');
const modal = document.getElementById('appointment-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.querySelector('.close-modal');
const appointmentForm = document.getElementById('appointment-form');

const profileNameDisplay = document.getElementById('profile-name-display');
const profileRoleDisplay = document.getElementById('profile-role-display');
const profileAvatar = document.getElementById('profile-avatar');

const monthsNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function init() {
    loadProfileSettings();
    renderCalendar();
    renderAppointments();
    setupEventListeners();
}

function formatDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// Carrega o cabeçalho do perfil de forma dinâmica (reflete o que foi editado na página de configurações)
function loadProfileSettings() {
    const savedName = localStorage.getItem('profileName') || "Usuário Comum";
    const savedRole = localStorage.getItem('profileRole') || "Minha Agenda";
    
    profileNameDisplay.textContent = savedName;
    profileRoleDisplay.textContent = savedRole;
    profileAvatar.textContent = savedName.charAt(0).toUpperCase();
}

// Renderiza o mini-calendário da direita
function renderCalendar() {
    calendarGrid.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYearDisplay.textContent = `${monthsNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (dateStr === selectedDateStr) dayDiv.classList.add('selected');

        dayDiv.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dayDiv.classList.add('selected');
            selectedDateStr = dateStr;
            renderAppointments();
        });

        calendarGrid.appendChild(dayDiv);
    }
}

// Renderiza a lista de compromissos do dia selecionado
function renderAppointments() {
    appointmentsList.innerHTML = '';
    const [y, m, d] = selectedDateStr.split('-');
    selectedDateTitle.textContent = `Compromissos de ${d}/${m}/${y}`;

    const dayEvents = eventsData[selectedDateStr] || [];

    if (dayEvents.length === 0) {
        appointmentsList.innerHTML = `<p style="color: var(--text-muted); text-align: center; margin-top: 40px;">Nenhum compromisso marcado para este dia.</p>`;
        return;
    }

    dayEvents.sort((a, b) => a.time.localeCompare(b.time));

    dayEvents.forEach((ev, index) => {
        const card = document.createElement('div');
        card.classList.add('appointment-card');
        card.innerHTML = `
            <span class="status-tag ${ev.status}">${ev.status}</span>
            <div class="card-time">${ev.time}</div>
            <h4>${ev.title}</h4>
            <div class="card-grid-details">
                <div><strong>Pessoa/Local:</strong> ${ev.agent || 'Não informado'}</div>
                <div><strong>Responsável:</strong> ${ev.responsible || 'Não informado'}</div>
                <div><strong>Pendências:</strong> ${ev.pending ? 'Sim (Exames/Doc)' : 'Nenhuma'}</div>
            </div>
            <button onclick="toggleStatus('${selectedDateStr}', ${index})" style="margin-top:12px; font-size:0.75rem; cursor:pointer; background:none; border:none; color:var(--accent-dark); text-decoration:underline; font-weight:600;">Alternar Status</button>
        `;
        appointmentsList.appendChild(card);
    });
}

// Alterna o estado de pendente/realizada e salva de volta no LocalStorage
window.toggleStatus = function(dateKey, index) {
    eventsData[dateKey][index].status = eventsData[dateKey][index].status === 'pendente' ? 'realizada' : 'pendente';
    localStorage.setItem('agendaEvents', JSON.stringify(eventsData));
    renderAppointments();
};

function setupEventListeners() {
    // Cliques de navegação de meses do calendário
    document.getElementById('prev-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('next-month').addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

    // Controle do Modal
    openModalBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    // Envio do formulário de novos compromissos
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newEvent = {
            title: document.getElementById('app-title').value,
            time: document.getElementById('app-time').value,
            agent: document.getElementById('app-agent').value,
            responsible: document.getElementById('app-responsible').value,
            pending: document.getElementById('app-pending').checked,
            status: document.getElementById('app-status').value
        };

        if (!eventsData[selectedDateStr]) eventsData[selectedDateStr] = [];
        eventsData[selectedDateStr].push(newEvent);
        localStorage.setItem('agendaEvents', JSON.stringify(eventsData));

        appointmentForm.reset();
        modal.style.display = 'none';
        renderAppointments();
    });
}

init();