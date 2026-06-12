const express = require('express');
const router = express.Router();
const db = require('../db');
const { gerarToken, verificarToken } = require('../middlewares/auth');


// Cadastrar novo usuário
router.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha)
        return res.status(400).json({ erro: 'Preencha todos os campos.' });

    db.query(
        'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, senha],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY')
                    return res.status(409).json({ erro: 'E-mail já cadastrado.' });
                return res.status(500).json({ erro: err.message });
            }
            res.status(201).json({ id_usuario: result.insertId, nome, email });
        }
    );
});

// Login
router.post('/login', (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha)
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });

    db.query(
        'SELECT id_usuario, nome, email, funcao_subtitulo FROM usuario WHERE email = ? AND senha = ?',
        [email, senha],
        (err, results) => {
            if (err) return res.status(500).json({ erro: err.message });
            if (results.length === 0)
                return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

            const u = results[0];
            res.json({ sucesso: true, usuario: { id_usuario: u.id_usuario, nome: u.nome, email: u.email, funcao_subtitulo: u.funcao_subtitulo || 'FamilyCare' } });
        }
    );
});

// Atualizar perfil
router.put('/atualizar/:id', (req, res) => {
    const { nome, funcao_subtitulo } = req.body;
    db.query(
        'UPDATE usuario SET nome = ?, funcao_subtitulo = ? WHERE id_usuario = ?',
        [nome, funcao_subtitulo, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ erro: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ erro: 'Usuário não encontrado.' });
            res.json({ sucesso: true });
        }
    );
});

module.exports = router;