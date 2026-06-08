CREATE DATABASE familycare;
USE familycare;

DROP TABLE IF EXISTS consulta;
DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    funcao_subtitulo VARCHAR(100) DEFAULT 'FamilyCare',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Consultas/Tarefas médicas (RdN1, RdN2)
-- status: 'a_fazer' | 'feito' | 'pendente' (RdN3, RdN4, RdN5)
CREATE TABLE consulta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,          -- obrigatório (RdN2)
    tipo VARCHAR(100) NOT NULL,            -- obrigatório (RdN2): consulta, exame, medicamento, etc.
    data_consulta DATE NOT NULL,
    horario TIME NOT NULL,
    medico_local VARCHAR(150) DEFAULT NULL,
    responsavel VARCHAR(100) DEFAULT NULL,
    tem_pendencias BOOLEAN DEFAULT FALSE,
    status ENUM('a_fazer', 'feito', 'pendente') DEFAULT 'a_fazer',  -- (RdN3)
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_consulta
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);
