'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const agent = require('superagent')
const realm = require('realm')
const app = express()

let Users = []

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(
    session({
        secret: "user session"
    })
)

app.set('view engine', 'ejs')

app.get('/', checkSignIn, (req, res) => {
    console.log(Users)
    res.render('index.ejs', { username: req.session.user.username })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/register', (reg, res) => {
    res.render('register.ejs')
})

app.post('/register', (req, res) => {
    let username = req.body['username']
    let password = req.body['password']

    userRealm.write(() => {
        userRealm.create('User', {
            username: username,
            password: password,
        })
    })

    res.render('register-success.ejs')
})

app.post('/login', (req, res) => {
    let username = req.body['username']
    let password = req.body['password']

    let user = userRealm.objects('User').filtered(
        'username = "' + username + '"' + ' AND ' + 'password = "' + password + '"'
    )

    if (user.length == 0) {
        res.send("Login failed, user not found")
    }
    else {
        Users.filter((user) => {
            if (user.id === username) {
                res.send("This user already logged in");
            }
        })

        let newUser = { username: username, password: password };

        Users.push(newUser);

        req.session.user = newUser;

        res.redirect('/')
    }
})

app.get('/delete', (req, res) => {
    userRealm.write(() => {
        let users = userRealm.objects('User')
        userRealm.deleteAll()
    })

    res.send("Deleted")
})

app.listen(3000, () => {
    console.log("Start")
})

function checkSignIn(req, res, next) {
    if (req.session.user) {
        return next();
    }
    else {
        res.redirect('/login')
    }
}