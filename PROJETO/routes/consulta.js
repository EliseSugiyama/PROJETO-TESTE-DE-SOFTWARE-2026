const express = require('express');
const router = express.Router();
const db = require('../db');


// Listar consultas de um usuário (filtrável por data)
router.get('/listar/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
    const { data } = req.query;

    let sql = 'SELECT * FROM consulta WHERE usuario_id = ?';
    const params = [usuario_id];

    if (data) { sql += ' AND data_consulta = ?'; params.push(data); }
    sql += ' ORDER BY data_consulta ASC, horario ASC';

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(results);
    });
});

// Criar nova consulta (RF4, RF6, RdN2, RdN3, RdN7)
router.post('/criar', (req, res) => {
    const { usuario_id, titulo, tipo, data_consulta, horario, medico_local, responsavel, tem_pendencias } = req.body;

    if (!usuario_id || !titulo || !tipo || !data_consulta || !horario)
        return res.status(400).json({ erro: 'Campos obrigatórios: usuario_id, titulo, tipo, data_consulta, horario.' });

    // RdN7: não permitir datas passadas
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataEvento = new Date(data_consulta + 'T00:00:00');
    if (dataEvento < hoje)
        return res.status(400).json({ erro: 'Não é permitido agendar consultas em datas passadas. (RdN7)' });

    // RdN3: status inicial sempre 'a_fazer'
    db.query(
        `INSERT INTO consulta (usuario_id, titulo, tipo, data_consulta, horario, medico_local, responsavel, tem_pendencias, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'a_fazer')`,
        [usuario_id, titulo, tipo, data_consulta, horario, medico_local || null, responsavel || null, tem_pendencias ? 1 : 0],
        (err, result) => {
            if (err) return res.status(500).json({ erro: err.message });
            res.status(201).json({ id: result.insertId, mensagem: 'Consulta criada com sucesso.' });
        }
    );
});

// Editar consulta (RF2, RF5)
router.put('/editar/:id', (req, res) => {
    const { titulo, tipo, data_consulta, horario, medico_local, responsavel, tem_pendencias } = req.body;

    if (!titulo || !tipo)
        return res.status(400).json({ erro: 'Título e tipo são obrigatórios.' });

    // RdN7: não permitir datas passadas na edição
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataEvento = new Date(data_consulta + 'T00:00:00');
    if (dataEvento < hoje)
        return res.status(400).json({ erro: 'Não é permitido reagendar para datas passadas. (RdN7)' });

    db.query(
        `UPDATE consulta SET titulo=?, tipo=?, data_consulta=?, horario=?, medico_local=?, responsavel=?, tem_pendencias=? WHERE id=?`,
        [titulo, tipo, data_consulta, horario, medico_local || null, responsavel || null, tem_pendencias ? 1 : 0, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ erro: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ erro: 'Consulta não encontrada.' });
            res.json({ sucesso: true });
        }
    );
});

// Alterar status (RF3, RdN4)
router.put('/status/:id', (req, res) => {
    const { status } = req.body;
    if (!['a_fazer', 'feito', 'pendente'].includes(status))
        return res.status(400).json({ erro: 'Status inválido.' });

    db.query('UPDATE consulta SET status = ? WHERE id = ?', [status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ erro: 'Consulta não encontrada.' });
        res.json({ sucesso: true });
    });
});

// Deletar consulta
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM consulta WHERE id = ?', [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ erro: 'Consulta não encontrada.' });
        res.sendStatus(204);
    });
});

// Estatísticas do usuário
router.get('/estatisticas/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
    db.query(
        `SELECT
            COUNT(*) AS total,
            SUM(status = 'feito') AS feitos,
            SUM(status = 'a_fazer') AS a_fazer,
            SUM(status = 'pendente') AS pendentes,
            SUM(tem_pendencias = 1) AS com_pendencias,
            DAYOFWEEK(data_consulta) - 1 AS dia_semana
         FROM consulta WHERE usuario_id = ? GROUP BY DAYOFWEEK(data_consulta)`,
        [usuario_id],
        (err, porDia) => {
            if (err) return res.status(500).json({ erro: err.message });
            db.query(
                `SELECT COUNT(*) AS total, SUM(status='feito') AS feitos, SUM(status='a_fazer') AS a_fazer,
                        SUM(status='pendente') AS pendentes, SUM(tem_pendencias=1) AS com_pendencias
                 FROM consulta WHERE usuario_id = ?`,
                [usuario_id],
                (err2, totais) => {
                    if (err2) return res.status(500).json({ erro: err2.message });
                    res.json({ totais: totais[0], por_dia_semana: porDia });
                }
            );
        }
    );
});

module.exports = router;