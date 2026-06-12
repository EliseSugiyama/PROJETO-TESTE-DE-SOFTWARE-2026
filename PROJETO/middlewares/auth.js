const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'familycare_secret_2026';

// Gera um token JWT para um usuário
function gerarToken(usuario) {
    return jwt.sign(
        { id: usuario.id_usuario, email: usuario.email },
        JWT_SECRET,
        { expiresIn: '8h' }
    );
}

// Middleware: verifica o token em rotas protegidas (RdN6)
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // disponibiliza { id, email } nas rotas
        next();
    } catch (err) {
        return res.status(403).json({ erro: 'Token inválido ou expirado. Faça login novamente.' });
    }
}

module.exports = { gerarToken, verificarToken };
