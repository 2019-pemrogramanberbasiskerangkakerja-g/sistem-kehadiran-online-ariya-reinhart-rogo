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
app.get('/home', (req, res) => {
    if(req.session.nama)
    {
        res.render("homeview.ejs",{nrp : req.session.nrp, nama : req.session.nama});
    }
    else
    {
        res.redirect("login");
    }
    
})

app.post('/login', (req, res) => {
    
    let nrp = req.body['nrp']
    let password = req.body['password']
    console.log(nrp)
    agent.post(apiHost + '/login')
        .send({
            nrp: nrp,
            password: password
        })
        .then(
            (response) => {
                console.log(response.status)
                if (response.status == 200) {
                    console.log(response.body[0].nama_user);
                    req.session.nama = response.body[0].nama_user;
                    req.session.nrp = nrp;
                    res.redirect("home");
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
                res.redirect('/login');
            }
        )
})

app.get('/login', (req, res) => {
    if (req.session.nama)
    {
        res.redirect("homeview.ejs");
    }   
    else
    {
        res.render("loginview.ejs");
    }
})

app.get('/daftar', (req, res) => {
    res.render('daftarview.ejs');
})

app.get('/tambahmatkul', (req, res) => {
    res.render('tambahmatkulview.ejs',{nrp : req.session.nrp, nama : req.session.nama});
})

app.get('/jadwal', (req, res) => {
    res.render('jadwalview.ejs',{nrp : req.session.nrp, nama : req.session.nama});
})

app.post('/jadwal', (req, res) => {
    let id = req.body['idMatkul']
    let pertemuan = req.body['pertemuan']
    let kelas = req.body['kelas']
    let masuk = req.body['masuk']
    let selesai = req.body['selesai']
    let angka = parseInt(pertemuan, 10)

    agent.post(apiHost + '/apitambahjadwal')
        .send({
            id_matkul: id,
            pertemuan_ke: angka,
            ruangan: kelas,
            waktu_awal: masuk,
            waktu_akhir: selesai
        })
        .then(
            (response) => {
                console.log(response)
                if (response.status == 200) {
                    res.redirect('/jadwal');
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
                res.redirect('/jadwal');
            }
        )
})

app.post('/tambahmatkul', (req, res) => {
    let idMatkul = req.body['idMatkul']
    let namaMatkul = req.body['namaMatkul']
    let kelas = req.body['kelas']
    console.log(idMatkul)
    agent.post(apiHost + '/tambahmatkul')
        .send({
            semester: idMatkul,
            nama_matkul: namaMatkul,
            kelas: kelas
        })
        .then(
            (response) => {
                if (response.status == 200) {
                    res.redirect('/home')
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
            }
        )
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
                    res.redirect("login");
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