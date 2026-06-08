// Autenticacao
const usuarioSalvo = sessionStorage.getItem('usuario');
if (!sessionStorage.getItem('userAuthenticated') || !usuarioSalvo) {
    window.location.href = '/';
}
const usuario = JSON.parse(usuarioSalvo);

// Estado
let currentDate   = new Date();
let selectedDateStr = formatDateKey(new Date());
let eventsData    = {};
let editandoId    = null;

// DOM
const monthYearDisplay   = document.getElementById('month-year-display');
const calendarGrid       = document.getElementById('calendar-grid');
const appointmentsList   = document.getElementById('appointments-list');
const selectedDateTitle  = document.getElementById('selected-date-title');
const selectedDateSubtitle = document.getElementById('selected-date-subtitle');
const modal              = document.getElementById('appointment-modal');
const openModalBtn       = document.getElementById('open-modal-btn');
const closeModalBtn      = document.querySelector('.close-modal');
const appointmentForm    = document.getElementById('appointment-form');
const upcomingList       = document.getElementById('upcoming-list');

const MESES = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS  = ["Domingo","Segunda","Terca","Quarta","Quinta","Sexta","Sabado"];

function formatDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

// --- Init ---
async function init() {
    loadProfile();
    await carregarConsultas();
    renderCalendar();
    renderAppointments();
    renderUpcoming();
    setupEventListeners();
}

function loadProfile() {
    document.getElementById('profile-name-display').textContent = usuario.nome || 'Usuario';
    document.getElementById('profile-role-display').textContent = usuario.funcao_subtitulo || 'FamilyCare';
    document.getElementById('profile-avatar').textContent = (usuario.nome || 'F').charAt(0).toUpperCase();
}

// --- API ---
async function carregarConsultas() {
    try {
        const res = await fetch(`/api/consulta/listar/${usuario.id_usuario}`);
        if (!res.ok) throw new Error('Falha ao buscar consultas');
        const lista = await res.json();
        eventsData = {};
        lista.forEach(c => {
            const key = c.data_consulta.toString().substring(0,10);
            if (!eventsData[key]) eventsData[key] = [];
            eventsData[key].push({
                id: c.id,
                titulo: c.titulo,
                tipo: c.tipo,
                horario: c.horario.substring(0,5),
                medico_local: c.medico_local,
                responsavel: c.responsavel,
                tem_pendencias: c.tem_pendencias === 1 || c.tem_pendencias === true,
                status: c.status
            });
        });
    } catch (err) { console.error('Erro ao carregar consultas:', err); }
}

// --- Calendario ---
function renderCalendar() {
    calendarGrid.innerHTML = '';
    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYearDisplay.textContent = `${MESES[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const total    = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const el = document.createElement('div');
        el.classList.add('calendar-day','empty');
        calendarGrid.appendChild(el);
    }
    for (let day = 1; day <= total; day++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const el = document.createElement('div');
        el.classList.add('calendar-day');
        el.textContent = day;
        if (dateStr === selectedDateStr)    el.classList.add('selected');
        if (eventsData[dateStr]?.length > 0) el.classList.add('has-events');
        el.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            el.classList.add('selected');
            selectedDateStr = dateStr;
            renderAppointments();
        });
        calendarGrid.appendChild(el);
    }
}

// --- Lista de consultas ---
function verificarPendente(lista, dateKey) {
    const hoje = formatDateKey(new Date());
    if (dateKey < hoje) lista.forEach(c => { if (c.status === 'a_fazer') c.status = 'pendente'; });
}

function renderAppointments() {
    appointmentsList.innerHTML = '';

    const [y,m,d] = selectedDateStr.split('-');
    const dateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
    selectedDateTitle.textContent    = `${String(d).replace(/^0/,'')} de ${MESES[parseInt(m)-1]}`;
    selectedDateSubtitle.textContent = DIAS[dateObj.getDay()];

    const dayEvents = (eventsData[selectedDateStr] || []).slice();
    verificarPendente(dayEvents, selectedDateStr);

    // Atualiza cards de resumo
    document.getElementById('summary-total').textContent   = dayEvents.length;
    document.getElementById('summary-feito').textContent   = dayEvents.filter(e => e.status === 'feito').length;
    document.getElementById('summary-afazer').textContent  = dayEvents.filter(e => e.status === 'a_fazer').length;
    document.getElementById('summary-pendente').textContent= dayEvents.filter(e => e.status === 'pendente').length;

    if (dayEvents.length === 0) {
        appointmentsList.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:32px 0;font-size:0.9rem;">Nenhuma consulta marcada para este dia.</p>`;
        return;
    }

    dayEvents.sort((a,b) => a.horario.localeCompare(b.horario));

    dayEvents.forEach(ev => {
        const card = document.createElement('div');
        card.classList.add('appointment-card');
        card.innerHTML = `
            <span class="status-tag ${ev.status}">${labelStatus(ev.status)}</span>
            <div class="card-time">${ev.horario}</div>
            <span class="card-tipo">${ev.tipo}</span>
            <h4>${ev.titulo}</h4>
            <div class="card-grid-details">
                <div><strong>Medico / Local:</strong> ${ev.medico_local || 'Nao informado'}</div>
                <div><strong>Responsavel:</strong> ${ev.responsavel || 'Nao informado'}</div>
                <div><strong>Pendencias:</strong> ${ev.tem_pendencias ? 'Sim — exames ou documentos' : 'Nenhuma'}</div>
            </div>
            <div class="card-actions">
                ${ev.status !== 'feito'
                    ? `<button class="btn-action concluir" onclick="marcarFeito(${ev.id},'${selectedDateStr}')">Marcar como feito</button>`
                    : `<button class="btn-action desfazer" onclick="marcarAFazer(${ev.id},'${selectedDateStr}')">Desfazer conclusao</button>`
                }
                <button class="btn-action editar"  onclick="abrirEdicao(${ev.id},'${selectedDateStr}')">Editar</button>
                <button class="btn-action excluir" onclick="deletarConsulta(${ev.id},'${selectedDateStr}')">Excluir</button>
            </div>
        `;
        appointmentsList.appendChild(card);
    });
}

function labelStatus(s) {
    if (s === 'a_fazer')  return 'A Fazer';
    if (s === 'feito')    return 'Feito';
    if (s === 'pendente') return 'Pendente';
    return s;
}

// --- Proximas consultas (sidebar) ---
function renderUpcoming() {
    if (!upcomingList) return;
    upcomingList.innerHTML = '';
    const hoje = formatDateKey(new Date());

    const proximas = Object.entries(eventsData)
        .filter(([key]) => key >= hoje)
        .sort(([a],[b]) => a.localeCompare(b))
        .flatMap(([key, eventos]) => eventos.map(ev => ({ ...ev, dateKey: key })))
        .slice(0, 5);

    if (proximas.length === 0) {
        upcomingList.innerHTML = `<li style="font-size:0.82rem;color:var(--text-muted);padding:8px 0;">Nenhuma consulta futura.</li>`;
        return;
    }

    proximas.forEach(ev => {
        const [y,m,d] = ev.dateKey.split('-');
        const li = document.createElement('li');
        li.classList.add('upcoming-item');
        li.innerHTML = `
            <span class="upcoming-item-date">${d}/${m}/${y} — ${ev.horario}</span>
            <span class="upcoming-item-title">${ev.titulo}</span>
            <span class="upcoming-item-tipo">${ev.tipo}</span>
        `;
        li.addEventListener('click', () => {
            selectedDateStr = ev.dateKey;
            currentDate = new Date(parseInt(y), parseInt(m)-1, 1);
            renderCalendar();
            renderAppointments();
        });
        upcomingList.appendChild(li);
    });
}

// --- Acoes ---
window.marcarFeito  = async (id, key) => alterarStatus(id, key, 'feito');
window.marcarAFazer = async (id, key) => alterarStatus(id, key, 'a_fazer');

async function alterarStatus(id, dateKey, status) {
    try {
        const res = await fetch(`/api/consulta/status/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Falha ao atualizar status');
        const ev = eventsData[dateKey]?.find(e => e.id === id);
        if (ev) ev.status = status;
        renderAppointments();
    } catch (err) { alert('Erro ao atualizar status.'); console.error(err); }
}

window.abrirEdicao = function(id, dateKey) {
    const ev = eventsData[dateKey]?.find(e => e.id === id);
    if (!ev) return;
    editandoId = id;
    document.getElementById('modal-title').textContent    = 'Editar Consulta';
    document.getElementById('edit-id').value              = id;
    document.getElementById('app-title').value            = ev.titulo;
    document.getElementById('app-tipo').value             = ev.tipo;
    document.getElementById('app-time').value             = ev.horario;
    document.getElementById('app-agent').value            = ev.medico_local || '';
    document.getElementById('app-responsible').value      = ev.responsavel || '';
    document.getElementById('app-pending').checked        = ev.tem_pendencias;
    modal.style.display = 'flex';
};

window.deletarConsulta = async function(id, dateKey) {
    if (!confirm('Excluir esta consulta?')) return;
    try {
        const res = await fetch(`/api/consulta/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Falha ao excluir');
        eventsData[dateKey] = eventsData[dateKey].filter(e => e.id !== id);
        renderCalendar();
        renderAppointments();
        renderUpcoming();
    } catch (err) { alert('Erro ao excluir.'); console.error(err); }
};

function resetModal() {
    editandoId = null;
    appointmentForm.reset();
    document.getElementById('modal-title').textContent = 'Nova Consulta';
    document.getElementById('edit-id').value = '';
}

// --- Eventos ---
function setupEventListeners() {
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById('next-month').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    openModalBtn.addEventListener('click', () => { resetModal(); modal.style.display = 'flex'; });
    closeModalBtn.addEventListener('click', () => { resetModal(); modal.style.display = 'none'; });
    window.addEventListener('click', e => { if (e.target === modal) { resetModal(); modal.style.display = 'none'; } });

    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '/';
    });

    appointmentForm.addEventListener('submit', async e => {
        e.preventDefault();

        const payload = {
            titulo:        document.getElementById('app-title').value,
            tipo:          document.getElementById('app-tipo').value,
            data_consulta: selectedDateStr,
            horario:       document.getElementById('app-time').value,
            medico_local:  document.getElementById('app-agent').value,
            responsavel:   document.getElementById('app-responsible').value,
            tem_pendencias: document.getElementById('app-pending').checked
        };

        try {
            let res, data;
            if (editandoId) {
                res  = await fetch(`/api/consulta/editar/${editandoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/api/consulta/criar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario_id: usuario.id_usuario, ...payload })
                });
            }

            data = await res.json();
            if (!res.ok) { alert(data.erro || 'Erro ao salvar.'); return; }

            await carregarConsultas();
            renderCalendar();
            renderAppointments();
            renderUpcoming();
            modal.style.display = 'none';
            resetModal();

        } catch (err) { alert('Erro ao salvar consulta.'); console.error(err); }
    });
}

init();
