var express = require('express');
var router = express.Router();

var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ariya123',
  database: 'pbkk'
})

connection.connect()
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});
router.post('/login', function(req, res, next) {
  var nrp = req.body.nrp;
  var pass = req.body.pass;
  // console.log(pass);
  var sql = 'SELECT * FROM akun WHERE nrp = ? and password = ?';
  connection.query(sql, [nrp,pass], function (err, result) {
    if (err) throw err;
    else if (!result.length) {                                                   
      res.render('login', { title: 'Login' });
    }
    else{
      res.render('home', { title: 'Login' });
    }
    console.log(result);
  });
 
});
module.exports = router;
