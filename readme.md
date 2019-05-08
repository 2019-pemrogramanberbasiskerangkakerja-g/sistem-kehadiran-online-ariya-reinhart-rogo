# Tugas 4 PBKK G
## Kelompok 1

### Anggota
+ Arya Wildan Devanto : 5115100123
+ Reinhart Caesar : 5115100132
+ Rogo Jagad Alit : 5115100168

### About
Database yang digunakan : [Realm](https://realm.io/ "Realm.io")

`api.js` file server API, `index.js` file aplikasi end-user

Setiap akan / sudah melakukan request ke API:
1. Cek format parameter
2. Setelah itu cek HTTP status code untuk memeriksa apakah request sukses (200) atau tidak (400, 404, 500 dsj)

### How to Run
1. Jalankan `npm install`
2. Jalankan `npm run serve` untuk jalankan nodemon untuk `index.js`
3. Jalankan `node api.js` untuk jalankan file `api.js`

### Endpoint List

**Detil dan nama parameter bisa dilihat di kodingan**

1. POST `/tambahmahasiswa`
Untuk menambah data mahasiswa

2. POST `/absen`
Untuk melakukan absen

3. POST `/tambahpeserta/:idmatakuliah/:kelas/:smt/:nrp`
Untuk menambah peserta ke mata kuliah dan kelas tertentu

4. POST `/tambahmatkul`
Untuk menambah data mata kuliah dan kelas

5. POST `/tambahjadwal`
Untuk menambah jadwal kelas

6. GET `/`
Untuk melihat isi DB

7. GET `/rekap/:idmatkul`
Melihat rekap kuliah per semester

8. GET `/rekap/:idmatkul/:pertemuanke`
Melihat rekap kuliah per pertemuan

9. GET `/rekapmahasiswa/:nrp/:idmatkul`
Melihat rekap per mahasiswa per matkul

10. GET `/rekapmahasiswa/:nrp/:idsemester`
Melihat rekap per mahasiswa per semester

11. GET `/delete`
Hapus isi DB

12. POST `/user`
Cek data user ada atau tidak