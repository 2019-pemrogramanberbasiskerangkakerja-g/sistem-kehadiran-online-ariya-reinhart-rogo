'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const realm = require('realm')
const app = express()

app.use(bodyParser.json())

let User = require('./models/User')
let Matkul = require('./models/Matkul')
let Jadwal = require('./models/Jadwal')

let userRealm = new Realm({
    path: 'realm-db/user.realm',
    schema: [User.Schema]
})

let matkulRealm = new Realm({
    path: 'realm-db/matkul.realm',
    schema: [Matkul.Schema]
})

let jadwalRealm = new Realm({
    path: 'realm-db/jadwal.realm',
    schema: [Jadwal.Schema]
})

app.post('/tambahmahasiswa', (req, res) => {
    let nrp = req.body.nrp
    let password = req.body.password
    let nama = req.body.nama
})

app.post('/absen', (req, res) => {
    let ruang = req.body.ruang
    let nrp = req.body.nrp
})

app.post('/tambahpeserta/:idmatakuliah/:nrp', (req, res) => {
    let idMatkul = req.params.idmatkul
    let nrp = req.params.nrp
})

app.post('/tambahmatkul', (req, res) => {
    let idMatkul = req.body.idmatkul
    let namaMatkul = req.body.namamatkul
    let kelas = req.body.kelas
})

app.post('/tambahjadwal', (req, res) => {
    let idMatkul = req.body.idmatkul
    let pertemuanKe = req.body.pertemuanke
    let ruang = req.body.ruangkelas
    let jamMasuk = req.body.jammasuk
    let jamSelesai = req.body.jamselesai

})

app.get('/rekap/:idmatakuliah/:pertemuanke', (req, res) => {
    let idMatkul = req.params.idmatakuliah
    let pertemuanKe = req.params.pertemuanke
})

app.get('/rekapmahasiswa/:nrp/:id', (req, res) => {
    let nrp = req.params.nrp
    let idMatkul = req.params.idmatakuliah
    let idSemester = req.params.idsemester
})

app.get('/delete', (req, res) => {
    userRealm.write(() => {
        let users = userRealm.objects('User')
        userRealm.deleteAll()
    })

    matkulRealm.write(() => {
        let matkul = matkulRealm.objects('Matkul')
        matkulRealm.deleteAll()
    })

    jadwalRealm.write(() => {
        let jadwal = jadwalRealm.objects('Jadwal')
        jadwalRealm.deleteAll()
    })

    res.send("Deleted")
})

app.listen(3001, () => {
    console.log("API Server started")
})