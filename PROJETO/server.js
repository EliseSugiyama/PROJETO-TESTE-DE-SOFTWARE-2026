const express = require('express')
const app = express()
const port = 3000

const db = require('./db'); 

const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  //res.send('Hello World!')
  res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
})

const apiROute = require('./routes/api');
app.use(express.json()); 
app.use('/api/users', apiROute);

app.listen(port, () => {
  console.log(`Servidor funcionando ${port}`)
})

