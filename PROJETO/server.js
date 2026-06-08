const express = require('express')
const app = express()
const port = 3000
const path = require('path');

const db = require('./db'); 


app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  //res.send('Hello World!')
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

function html(nomeArquivo) {
    return (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'html', nomeArquivo));
    };
}


app.get('/',                html('index.html'));
app.get('/index',           html('index.html'));
app.get('/cadastro',        html('cadastro.html'));
app.get('/home',            html('home.html'));
app.get('/estatistica',     html('estatistica.html'));
app.get('/configuracoes',   html('configuracoes.html'));


const usuarioRoute = require('./routes/usuario');
const consultaRoute = require('./routes/consulta');

app.use('/api/usuario', usuarioRoute);
app.use('/api/consulta', consultaRoute);

app.listen(port, () => {
  console.log(`Servidor funcionando ${port}`)
});
