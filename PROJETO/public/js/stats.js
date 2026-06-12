const usuarioSalvo = sessionStorage.getItem('usuario');
if (!sessionStorage.getItem('userAuthenticated') || !usuarioSalvo) { window.location.href = '/'; }
const usuario = JSON.parse(usuarioSalvo);

async function initStatsPage() {
    loadProfileHeader();
    await calculateStatistics();
}

function loadProfileHeader() {
    const nome = usuario.nome || 'Usuario';
    document.getElementById('profile-name-display').textContent = nome;
    document.getElementById('profile-role-display').textContent = usuario.funcao_subtitulo || 'FamilyCare';
    document.getElementById('profile-avatar').textContent       = nome.charAt(0).toUpperCase();
}

async function calculateStatistics() {
    try {
        const [estRes, listRes] = await Promise.all([
            apiFetch(`/api/consulta/estatisticas/${usuario.id_usuario}`),
            apiFetch(`/api/consulta/listar/${usuario.id_usuario}`)
        ]);
        const est   = await estRes.json();
        const lista = await listRes.json();

        const total         = parseInt(est.totais.total)          || 0;
        const feitos        = parseInt(est.totais.feitos)         || 0;
        const pendentes     = parseInt(est.totais.pendentes)      || 0;
        const comPendencias = parseInt(est.totais.com_pendencias) || 0;

        document.getElementById('total-tasks').textContent    = total;
        document.getElementById('done-tasks').textContent     = feitos;
        document.getElementById('pending-tasks').textContent  = pendentes;
        document.getElementById('pending-exams').textContent  = comPendencias;

        const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;
        document.getElementById('stats-progress-fill').style.width    = `${pct}%`;
        document.getElementById('stats-progress-percent').textContent = `${pct}%`;

        const msgEl = document.getElementById('efficiency-msg');
        if      (pct === 100 && total > 0) msgEl.textContent = 'Todas as consultas foram realizadas.';
        else if (pct >= 70)                msgEl.textContent = 'Bom progresso. Consultas em dia.';
        else if (pct >= 40)                msgEl.textContent = 'Andamento razoavel. Continue acompanhando.';
        else if (total === 0)              msgEl.textContent = 'Nenhuma consulta registrada ainda.';
        else                               msgEl.textContent = 'Atencao: ha consultas pendentes.';

        const weekly = [0,0,0,0,0,0,0];
        est.por_dia_semana.forEach(row => {
            const d = parseInt(row.dia_semana);
            if (d >= 0 && d <= 6) weekly[d] = parseInt(row.feitos) || 0;
        });
        const maxVal = Math.max(...weekly, 1);
        ['bar-dom','bar-seg','bar-ter','bar-qua','bar-qui','bar-sex','bar-sab'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) { el.style.height = `${(weekly[i]/maxVal)*100}%`; el.title = `${weekly[i]} concluida(s)`; }
        });

        const recentes = lista.filter(c => c.status === 'feito' || c.status === 'pendente').slice(-5).reverse();
        const listEl = document.getElementById('recent-done-list');
        listEl.innerHTML = '';

        if (recentes.length === 0) {
            listEl.innerHTML = `<li style="font-size:0.85rem;color:var(--text-muted);padding:12px 0;">Nenhuma atividade recente.</li>`;
            return;
        }

        recentes.forEach(c => {
            const data  = c.data_consulta.toString().substring(0,10).split('-').reverse().slice(0,2).join('/');
            const hora  = c.horario.substring(0,5);
            const badge = c.status === 'feito'
                ? `<span class="recent-badge-done">FEITO</span>`
                : `<span class="recent-badge-pendente">PENDENTE</span>`;
            const li = document.createElement('li');
            li.classList.add('recent-item');
            li.innerHTML = `
                <div class="recent-item-info">${badge}<strong>${c.titulo}</strong><span style="font-size:0.75rem;color:var(--text-muted)">${c.tipo}</span></div>
                <span style="color:var(--text-muted);font-size:0.8rem;white-space:nowrap;">${data} as ${hora}</span>
            `;
            listEl.appendChild(li);
        });

    } catch (err) {
        document.getElementById('efficiency-msg').textContent = 'Erro ao carregar dados do servidor.';
        console.error(err);
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => { sessionStorage.clear(); window.location.href = '/'; });
}

window.onload = initStatsPage;
