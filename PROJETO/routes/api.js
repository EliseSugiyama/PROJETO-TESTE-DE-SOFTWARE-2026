const express = require('express'); 
const router = express.Router();

const db = require('../db');

router.post('/cadastrar', (req, res) =>{
    const {nome, email} = req.body; 
    
    db.query('insert into users(nome, email) values (?, ?)', [nome, email], (err, result) => {
        if(err) return res.status(500).send(err); 
        res.status(201).json({id:result.insertId, nome, email}); 
    })
    
    
});


router.get('/listar', (req, res) => {
    db.query('select * from users', (err, results) =>{
        if(err) return res.status(500).send(err); 
        res.json(results); 
    })
});

router.delete('/:id', (req, res)=>{
    const {id} = req.params;
    db.query('delete from users where id = ?', [id],
    (err) => {
        if(err) return res.status(500).send(err); 
        res.sendStatus(204); 

    })
});

module.exports = router; 