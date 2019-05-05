'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const realm = require('realm')
const app = express()
const moment = require('moment')

app.use(bodyParser.json())

let User = require('./models/User')
let Matkul = require('./models/Matkul')
let Jadwal = require('./models/Jadwal')
let Peserta = require('./models/Peserta')

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

let pesertaRealm = new Realm({
    path: 'realm-db/peserta.realm',
    schema: [Peserta.Schema]
})

app.post('/tambahmahasiswa', (req, res) => {
    let nrp = req.body.nrp
    let password = req.body.password
    let nama = req.body.nama

    if (password && nrp && nama) {
        userRealm.write(() => {
            userRealm.create('User', {
                nrp: nrp,
                nama: nama,
                password: password,
            })
        })

        res.status(201)
            .json({
                message: "User created"
            })

    }
    else {
        res.status(400)
            .json({
                message: "Parameter not complete"
            })
    }
})

app.post('/absen', (req, res) => {
    let ruang = req.body.ruang
    let nrp = req.body.nrp

    if (ruang && nrp) {
        let jadwal = jadwalRealm.objects('Jadwal').filtered(
            'ruang = "' + ruang + '"'
        )

        let todayTime = new Date()
        let idMatkul = ""
        let pertemuanKe = "1"

        for (var i = 0; i < jadwal.length; i++) {
            let jamMasuk = jadwal[i].jamMasuk
            let jamSelesai = jadwal[i].jamSelesai

            if (todayTime.getDate() == jamMasuk.getDate() && todayTime.getMonth() == jamMasuk.getMonth()) {
                if (todayTime.getHours() >= jamMasuk.getHours() && todayTime.getHours() <= jamSelesai.getHours()) {
                    if (todayTime.getMinutes() <= jamSelesai.getMinutes()) {
                        idMatkul = jadwal[i].idMatkul;
                        pertemuanKe = jadwal[i].pertemuanKe.toString();

                        break;
                    }
                }
            }
        }

        let peserta = pesertaRealm.objects('Peserta').filtered(
            'nrp = "' + nrp + '"' + ' AND ' + 'idMatkul = "' + idMatkul + '"'
        )

        pesertaRealm.write(() => {
            peserta[0]["p" + pertemuanKe] = 1
        })

        console.log(peserta[0])

        res.status(200).json({ message: "Success" })
    }
    else {
        res.status(400)
            .json({
                message: "Parameter not complete or key is wrong"
            })
    }
})

app.post('/tambahpeserta', (req, res) => {
    // let kelas = req.params.kelas
    let idMatkul = req.body.idmatkul
    let nrp = req.body.nrp
    let smt = req.body.smt
    console.log(idMatkul)
    if (idMatkul && nrp && smt) {
        if (isIdMatkulExists(idMatkul) && isNrpExists(nrp)) {

            pesertaRealm.write(() => {
                pesertaRealm.create('Peserta', {
                    idMatkul: idMatkul,
                    nrp: nrp,
                    semester: smt
                })
            })

            res.status(201)
                .json({
                    message: "Peserta added"
                })
        }
        else {
            res.status(404)
                .json({
                    message: "ID Matkul or NRP is not exists"
                })
        }
    }
    else {
        res.status(400)
            .json({
                message: "Parameter not complete or key is wrong"
            })
    }
})

app.post('/tambahmatkul', (req, res) => {
    let idMatkul = req.body.idmatkul
    let namaMatkul = req.body.namamatkul
    let kelas = req.body.kelas

    if (idMatkul && namaMatkul && kelas) {
        matkulRealm.write(() => {
            matkulRealm.create('Matkul', {
                idMatkul: idMatkul + "-" + kelas,
                namaMatkul: namaMatkul,
            })
        })

        res.status(201)
            .json({
                message: "Matkul created"
            })
    }
    else {
        res.status(400)
            .json({
                message: "Parameter not complete or key is wrong"
            })
    }
})

app.post('/tambahjadwal', (req, res) => {
    let idMatkul = req.body.idmatkul
    let pertemuanKe = req.body.pertemuanke
    let ruang = req.body.ruangkelas
    let jamMasuk = req.body.jammasuk
    let jamSelesai = req.body.jamselesai

    if (idMatkul && pertemuanKe && ruang && jamMasuk && jamSelesai) {
        if (isIdMatkulExists(idMatkul)) {
            jadwalRealm.write(() => {
                jadwalRealm.create('Jadwal', {
                    idMatkul: idMatkul,
                    pertemuanKe: pertemuanKe,
                    ruang: ruang,
                    jamMasuk: jamMasuk,
                    jamSelesai: jamSelesai
                })
            })

            res.status(201)
                .json({
                    message: "Jadwal created"
                })
        }
        else {
            res.status(404)
                .json({
                    message: "Mata kuliah with this ID not exists"
                })
        }
    }
    else {
        res.status(400)
            .json({
                message: "Parameter not complete"
            })
    }

})

app.get('/', (req, res) => {
    let user = userRealm.objects('User')
    let matkul = matkulRealm.objects('Matkul')
    let jadwal = jadwalRealm.objects('Jadwal')
    let peserta = pesertaRealm.objects('Peserta')

    res.json({
        user: user,
        matkul: matkul,
        jadwal: jadwal,
        peserta: peserta
    })
})

app.get('/rekap/:idmatakuliah', (req, res) => {
    let idMatkul = req.params.idmatakuliah
    let rekap = {}

    rekap = pesertaRealm.objects('Peserta').filtered(
        'idMatkul = "' + idMatkul + '"'
    )

    res.status(200).send(rekap)
})

app.get('/rekap/:idmatakuliah/:pertemuanke', (req, res) => {
    let idMatkul = req.params.idmatakuliah
    let pertemuanKe = req.params.pertemuanke
    let rekap = {}

    let pertemuanQuery = "p" + pertemuanKe

    let result = pesertaRealm.objects('Peserta').filtered(
        'idMatkul = "' + idMatkul + '"'
    )
    // console.log(result[0]["nrp"])
    rekap["idMatkul"] = idMatkul
    rekap["pertemuanKe"] = pertemuanKe
    rekap["data"] = {}

    for (var i = 0; i < result.length; i++) {
        let nrp = result[i]["nrp"]
        let pertemuanRec = result[i][pertemuanQuery]

        rekap["data"][nrp] = pertemuanRec
    }

    res.status(200).send(rekap)
})

app.get('/rekapmahasiswa/:nrp/:id', (req, res) => {
    let nrp = req.params.nrp
    let id = req.params.id
    let rekap = {}

    if (parseInt(id)) { //is semester ID, record per mahasiswa per semester
        rekap = pesertaRealm.objects('Peserta').filtered(
            'nrp = "' + nrp + '"' + ' AND ' + 'semester = "' + id + '"'
        )
    }
    else { //is matkul id, record per mahasiswa per matkul
        rekap = pesertaRealm.objects('Peserta').filtered(
            'nrp = "' + nrp + '"' + ' AND ' + 'idMatkul = "' + id + '"'
        )
    }

    res.status(200)
    res.send(rekap)
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

    pesertaRealm.write(() => {
        let peserta = pesertaRealm.objects('Peserta')
        pesertaRealm.deleteAll()
    })

    res.send("Deleted")
})

app.post('/user', (req, res) => {
    let nrp = req.body.nrp
    let password = req.body.password

    let user = userRealm.objects('User').filtered(
        'nrp = "' + nrp + '"' + ' AND ' + 'password = "' + password + '"'
    )

    if (user.length == 0) {
        res.status(404).json({
            message: "User not found"
        })
    }
    else {
        res.status(200).json({
            message: "User found"
        })
    }
})

app.listen(3001, () => {
    console.log("API Server started")
})

function parseDate(s) {
    let tgl = moment(s)
    return tgl.utc().format('HH:mm:ss')
}

function isIdMatkulExists(id) {
    let matkul = matkulRealm.objects('Matkul').filtered(
        'idMatkul = "' + id + '"'
    )

    if (matkul.length == 0) {
        return false
    }
    else {
        return true
    }
}

function isNrpExists(nrp) {
    let user = userRealm.objects('User').filtered(
        'nrp = "' + nrp + '"'
    )

    if (user.length == 0) {
        return false
    }
    else {
        return true
    }
}
