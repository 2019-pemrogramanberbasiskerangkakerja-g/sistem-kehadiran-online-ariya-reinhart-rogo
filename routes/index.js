var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();

app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ariya123',
  database: 'pbkk'
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  req.session.page_views = 1;
  res.render('login', { title: 'Login' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});
router.get('/home', function(req, res, next) {
    if(req.session) {
      // var nrp = req.session.nrp;
      res.render('home');
    }
    else {
      res.redirect('/login');
    }
  // res.send("hai")
});
router.post('/loginoke', function(req, res, next) {
  var nrp = req.body.nrp;
  var pass = req.body.pass;
  sess = req.session;
  // console.log(pass);
  var sql = 'SELECT * FROM akun WHERE nrp = ? and password = ?';
  connection.query(sql, [nrp,pass], function (err, result) {
    if (result.length > 0) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect('/home');
    } else {
      res.send('Incorrect Username and/or Password!');
    }			
    res.end();
  });
});
module.exports = router;
