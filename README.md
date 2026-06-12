# Projeto Final de Teste de Software (FamilyCare)

## Como executar

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```
2. Verifique as credenciais do banco de dados em `db.js`.
   - Se necessário, adicione `password: 'sua_senha'` e ajuste o `host`/`port`/`user`.
3. Inicie o servidor:
   ```bash
   npm start
   ```

### Alternativa 

Para iniciar com recarga automática ao salvar:
```bash
npx nodemon server.js
```

## Dependências principais

- Express (^5.2.1)
- Jsonwebtoken (^9.0.3)
- Mysql2 (^3.22.5)
- Nodemon (^3.1.14)