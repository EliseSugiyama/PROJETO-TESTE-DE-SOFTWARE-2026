const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    database: 'sistema_agenda',
});


db.connect( err =>{
    if(err) throw err;
    console.log('conectado ao banco de dados'); 
});

module.exports = db; 