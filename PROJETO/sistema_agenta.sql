CREATE DATABASE IF NOT EXISTS sistema_agenda;
USE sistema_agenda;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- Em produção, armazena-se o hash da senha
    funcao_subtitulo VARCHAR(100) DEFAULT 'Minha Agenda',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Compromissos
CREATE TABLE compromisso (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    data_compromisso DATE NOT NULL,
    horario TIME NOT NULL,
    pessoa_local VARCHAR(150) DEFAULT NULL,
    responsavel VARCHAR(100) DEFAULT NULL,
    tem_pendencias BOOLEAN DEFAULT FALSE,
    status_compromisso ENUM('pendente', 'realizada') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Vincula o compromisso ao seu respectivo usuário
    CONSTRAINT fk_usuario_compromisso 
        FOREIGN KEY (usuario_id) 
        REFERENCES usuario(id) 
        ON DELETE CASCADE
);