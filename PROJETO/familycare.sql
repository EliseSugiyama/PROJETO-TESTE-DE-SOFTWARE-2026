CREATE DATABASE familycare;
USE familycare;
drop database familycare; 

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    funcao_subtitulo VARCHAR(100) DEFAULT 'FamilyCare',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE consulta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,          
    tipo VARCHAR(100) NOT NULL,            
    data_consulta DATE NOT NULL,
    horario TIME NOT NULL,
    medico_local VARCHAR(150) DEFAULT NULL,
    responsavel VARCHAR(100) DEFAULT NULL,
    tem_pendencias BOOLEAN DEFAULT FALSE,
    status ENUM('a_fazer', 'feito', 'pendente') DEFAULT 'a_fazer',  
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_consulta
        FOREIGN KEY (usuario_id)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);