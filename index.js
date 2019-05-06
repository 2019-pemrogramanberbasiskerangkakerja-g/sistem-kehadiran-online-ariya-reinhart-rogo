'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const agent = require('superagent')
const realm = require('realm')
const app = express()
const apiHost = 'localhost:3001'

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
    agent.get(apiHost)
        .then(
            (response) => {
                res.render('index.ejs', { nrp: req.session.user.nrp, matkul: response.body.matkul, peserta: response.body.peserta })
            }
        )
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/register', (req, res) => {
    res.render('register.ejs')
})

app.post('/register', (req, res) => {
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
                if (response.status == 201) {
                    res.render('register-success.ejs')
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
            }
        )
})

app.post('/login', (req, res) => {
    let nrp = req.body['nrp']
    let password = req.body['password']

    agent.post(apiHost + '/user')
        .send({
            nrp: nrp,
            password: password
        })
        .then(
            (response) => {
                if (response.status == 200) {
                    let newUser = { nrp: nrp, password: password };
                    Users.push(newUser);
                    req.session.user = newUser;
                    res.redirect('/')
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
            }
        )
})

app.post('/absen', (req, res) => {
    let ruang = req.body['ruang']
    let nrp = req.body['nrp']

    agent.post(apiHost + '/absen')
        .send({
            ruang: ruang,
            nrp: nrp
        })
        .then(
            (response) => {
                if (response.status == 200) {
                    res.redirect('/')
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
            }
        )
})

app.get('/tambahmatkul', (req, res) => {
    res.render('tambahmatkul.ejs')
})

app.post('/tambahmatkul', (req, res) => {
    let idMatkul = req.body['idMatkul']
    let namaMatkul = req.body['namaMatkul']
    let kelas = req.body['kelas']

    agent.post(apiHost + '/tambahmatkul')
        .send({
            idMatkul: idMatkul,
            namaMatkul: namaMatkul,
            kelas: kelas
        })
        .then(
            (response) => {
                if (response.status == 201) {
                    res.redirect('/tambahmatkul')
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
            }
        )
})

app.post('/tambahpeserta', (req, res) => {
    let idmatakuliah = req.body['idmatkul']
    let smt = req.body['smt']
    let nrp = req.body['nrp']

    agent.post(apiHost + '/tambahpeserta')
        .send({
            idmatakuliah: idmatakuliah,
            smt: smt,
            nrp: nrp
        })
        .then(
            (response) => {
                if (response.status == 201) {
                    res.redirect('/')
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
            }
        )
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
//https://pbkk-online-absen-api.herokuapp.com