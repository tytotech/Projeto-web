const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const handlebars = require('express-handlebars')
const index = express()
const urlencodeParser = bodyParser.urlencoded({extended:false})

const sql = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    post: 3306
})
sql.query("use db")


//
index.engine("handlebars", handlebars({defaultLayout:'main'}))
index.set('view engine', 'handlebars')
index.use('/css', express.static('css'))
index.use('/js', express.static('js'))

//Rota para pagina princial
index.get("/", function(req, res) {
    res.render('index')
})

index.get("/inserir", function(req, res) {
    res.render("inserir")
})

index.get("/select:id?", function(req, res) {
    if (!req.params.id) {
        sql.query("select * from task", function(err, results, fields){
            res.render('select', {data:results})
        })
    } else {
        sql.query("select * from task where id=? order by id asc", [req.params.id], function(err, results, fields){
            res.render('select', {data:results})
        })
    }
})

index.post("/controllerForm", urlencodeParser, function(req, res){
    sql.query("insert into task values (?,?,?,?,?,?)", [req.body.id, req.body.name, req.body.description, req.body.start_date, req.body.end_date, req.body.priority])
    res.render('controllerform')
})

index.get('/deletar/:id', function(req, res) {
    sql.query("delete from task where id=?", [req.params.id])
    res.render('deletar')
})

index.get("/update/:id", function(req, res) {
    sql.query("select * from task where id=?", [req.params.id], function(err, results, fields) {
        res.render('update', {id:req.params.id, name:results[0].name, description:results[0].description, start_date:results[0].start_date, end_date:results[0].end_date, priority:results[0].priority})
    })
})

index.post("/controllerUpdate", urlencodeParser, function(req, res) {
    sql.query("update task set name=?, description=?, start_date=?, end_date=?, priority=?", [req.body.name, req.body.description, req.body.start_date, req.body.end_date, req.body.priority, req.body.id])
    res.render('controllerUpdate')
})

//Start servidor
index.listen(3000, function(req, res){
    console.log('servidor Ok')
})