var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');

var app = express();
var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ariya123',
  database: 'pbkk'
})
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index', { title: 'Express' });
});
app.get('/login', function(req, res, next) {
    req.session.nrp = false;
    res.render('login', { title: 'Login' });
  });
app.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });
  });
app.post('/loginoke', function(req, res, next) {
    var nrp = req.body.nrp;
    console.log(nrp)
    var pass = req.body.pass;
    var sql = 'SELECT * FROM akun WHERE nrp = ? and password = ?';
    connection.query(sql, [nrp,pass], function (err, result) {
      if (result.length > 0) {
        req.session.nrp = true;
        res.redirect('/home');
      } else {
        res.send('Incorrect Username and/or Password!');
      }			
      res.end();
    });
  });
app.get('/home', function(req, res, next) {
    if(req.session.nrp==true) {
      res.render('home');
    }
    else {
      res.redirect('/login');
    }
});
app.listen(3000);