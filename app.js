var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var express = require('express');
var bodyPaser = require('body-parser');

var client =  mysql.createConnection({
    user:'root',
    password:'1234',
    database:'Dicon'
});

var app = express();
app.use(bodyPaser.urlencoded({
    extended: false
}));

app.listen(52273, function (){
    console.log('Server Running http://hansung.info/');
});

app.get('/', function (request, response){
    fs.readFile('list.html', 'utf-8', function (error, data){
        client.query('SELECT * FROM signup', function (error, results){
            response.send(ejs.render(data, {
                data: results
            }));
        });
    });
});

app.get('/delete/:Id',function (request, response){
    client.query('DELETE FROM signup WHERE Id=?', [request.params.Id], function(){
        response.redirect('/');
    });

});

app.get('/insert', function (request, response){
    fs.readFile('insert.html', 'utf-8', function (error, data){
        response.send(data);
    });
});

app.post('/insert', function (request, response){
    var body = request.body;
    client.query('INSERT INTO signup (Username, Id, Password) VALUES (?, ?, ?)',[
        body.Username, body.Id, body.Password
    ], function () {
        response.redirect('/');
    });
});

app.get('/edit/:Id', function (request, response){
    fs.readFile('edit.html', 'utf-8', function(error, data){
        client.query('SELECT * FROM  signup WHERE Id = ?', [
            request.params.Id
        ], function(error, result){
            response.send(ejs.render(data, {
                data: result[0]
            }));
        });
    });
});

app.post('/edit/:Id', function(request, response){
    var body = request.body;
    client.query('UPDATE signup SET Username=?, Id=?, Password=? WHERE Id=?',[
        body.Username, body.Id, body.Password, request.params.Id
    ], function(err,re){
        console.log(err);
        response.redirect('/');
    });
});
