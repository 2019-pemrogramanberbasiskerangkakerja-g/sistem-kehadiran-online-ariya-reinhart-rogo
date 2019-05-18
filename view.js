'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const agent = require('superagent')
const realm = require('realm')
const app = express()
var request = require('request');

// const apiHost = 'https://pbkk-online-absen-api.herokuapp.com'
const apiHost = 'http://localhost:8000'
var path = require("path");

let Users = []
// app.use('/static', express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
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
app.get('/', (req, res) => {
    res.redirect("login");
})

app.get('/login', (req, res) => {
    res.send("hallo");
})

app.get('/daftar', (req, res) => {
    res.render('daftarview.ejs');
})

app.post('/daftar', (req, res) => {
    let nrp = req.body['nrp']
    let nama = req.body['nama']
    let password = req.body['password']

    agent.post(apiHost + '/tambahmahasiswa')
        .send({
            nrp: nrp,
            nama: nama,
            password: password
        })
        .then(
            (response) => {
                if (response.status == 200) {
                    res.send("berhasil");
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
            }
        )
})
app.listen(8001, () => {
    console.log("Start")
})