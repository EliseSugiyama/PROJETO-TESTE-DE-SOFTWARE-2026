# PROJETO-TESTE-DE-SOFTWARE-2026

# Sistema Agenda

Aplicação web de calendário com gerenciamento de compromissos. Cada usuário tem sua própria agenda, pode registrar compromissos por dia, acompanhar o status de cada um e visualizar estatísticas de produtividade.

## Tecnologias

- **Back-end:** Node.js, Express 5
- **Banco de dados:** MySQL 8 (via mysql2)
- **Front-end:** HTML, CSS e JavaScript vanilla
- **Utilitários:** nodemon (hot reload em desenvolvimento)

## Estrutura do projeto

```
PROJETO/
├── server.js                  # Ponto de entrada — registra rotas e sobe o servidor
├── db.js                      # Conexão com o MySQL
├── schema.sql                 # Script de criação do banco e tabelas
├── routes/
│   ├── users.js               # CRUD de usuários + login
│   └── appointments.js        # CRUD de compromissos
└── public/
    ├── html/
    │   ├── index.html         # Tela de login
    │   ├── cadastro.html      # Tela de cadastro
    │   ├── home.html          # Calendário principal
    │   ├── estatistica.html   # Dashboard de estatísticas
    │   └── configuracoes.html # Configurações de perfil
    ├── css/                   # Estilos por página
    └── js/
        ├── login.js           # Autenticação
        ├── cadastro.js        # Criação de conta
        ├── script.js          # Lógica do calendário e compromissos
        ├── stats.js           # Cálculo e exibição de estatísticas
        └── configuracoes.js   # Atualização de perfil e exclusão de conta
```

## Pré-requisitos

- Node.js 18+
- MySQL 8+

## Instalação e execução

**1. Clone o repositório e instale as dependências:**

```bash
git clone <url-do-repositorio>
cd PROJETO
npm install
```

**2. Crie o banco de dados:**

```bash
mysql -u root -p < schema.sql
```

Isso cria o banco `sistema_agenda` e as tabelas `users` e `appointments`.

**3. Configure a senha do banco (opcional):**

Se o seu MySQL tiver senha, defina a variável de ambiente antes de subir o servidor:

```bash
export DB_PASSWORD=sua_senha
```

**4. Suba o servidor:**

```bash
# Produção
npm start

# Desenvolvimento (com hot reload)
npx nodemon server.js
```

**5. Acesse no navegador:**

```
http://localhost:3000
```

## Banco de dados

### Tabela `users`

| Coluna      | Tipo          | Descrição                   |
|-------------|---------------|-----------------------------|
| id          | INT (PK)      | Identificador               |
| nome        | VARCHAR(200)  | Nome do usuário             |
| email       | VARCHAR(255)  | E-mail único                |
| senha       | VARCHAR(255)  | Senha                       |
| criado_em   | TIMESTAMP     | Data de criação             |

### Tabela `appointments`

| Coluna      | Tipo                        | Descrição                          |
|-------------|-----------------------------|------------------------------------|
| id          | INT (PK)                    | Identificador                      |
| user_id     | INT (FK → users.id)         | Dono do compromisso                |
| titulo      | VARCHAR(200)                | Título do compromisso              |
| horario     | TIME                        | Horário                            |
| data        | DATE                        | Data                               |
| agente      | VARCHAR(200)                | Pessoa, médico ou local            |
| responsavel | VARCHAR(200)                | Familiar ou responsável            |
| pendencias  | TINYINT(1)                  | Indica se há exames/documentos     |
| status      | ENUM(pendente, realizada)   | Status atual                       |
| criado_em   | TIMESTAMP                   | Data de criação                    |

> Ao excluir um usuário, todos os seus compromissos são removidos automaticamente (`ON DELETE CASCADE`).

## API

### Usuários — `/api/users`

| Método | Rota                  | Descrição                    |
|--------|-----------------------|------------------------------|
| POST   | `/cadastrar`          | Cria um novo usuário         |
| POST   | `/login`              | Autentica e retorna os dados |
| GET    | `/`                   | Lista todos os usuários      |
| GET    | `/:id`                | Busca um usuário por ID      |
| PUT    | `/:id`                | Atualiza nome e e-mail       |
| DELETE | `/:id`                | Remove o usuário             |

**Exemplos de corpo:**

```json
// POST /api/users/cadastrar
{ "nome": "Ana Costa", "email": "ana@email.com", "senha": "123456" }

// POST /api/users/login
{ "email": "ana@email.com", "senha": "123456" }

// PUT /api/users/:id
{ "nome": "Ana Costa Silva", "email": "ana@email.com" }
```

### Compromissos — `/api/appointments`

| Método | Rota           | Descrição                            |
|--------|----------------|--------------------------------------|
| POST   | `/`            | Cria um compromisso                  |
| GET    | `/?user_id=X`  | Lista compromissos do usuário        |
| GET    | `/:id`         | Busca um compromisso por ID          |
| PUT    | `/:id`         | Atualiza todos os campos             |
| PATCH  | `/:id/status`  | Alterna apenas o status              |
| DELETE | `/:id`         | Remove o compromisso                 |

**Exemplos de corpo:**

```json
// POST /api/appointments
{
  "user_id": 1,
  "titulo": "Consulta cardiologista",
  "horario": "14:30",
  "data": "2026-06-15",
  "agente": "Dr. Carlos",
  "responsavel": "João",
  "pendencias": true,
  "status": "pendente"
}

// PATCH /api/appointments/:id/status
{ "status": "realizada" }
```

## Funcionalidades

**Autenticação**
- Cadastro e login com e-mail e senha
- Sessão mantida via `sessionStorage` (encerrada ao fechar o navegador)

**Calendário**
- Navegação por meses
- Dias com compromissos são marcados visualmente
- Clique em qualquer dia exibe os compromissos daquele dia

**Compromissos**
- Criar, editar e excluir diretamente nos cards do calendário
- Alternar status entre *pendente* e *realizada* com um clique
- Campos: título, horário, pessoa/local, responsável, flag de pendências e status

**Estatísticas**
- Total de compromissos cadastrados
- Quantidade de compromissos realizados e com pendências
- Gráfico de barras com distribuição de conclusões por dia da semana
- Taxa de conclusão geral
- Últimas três atividades concluídas

**Configurações**
- Atualização do nome de exibição do perfil
- Exclusão completa da conta (remove usuário e todos os compromissos)