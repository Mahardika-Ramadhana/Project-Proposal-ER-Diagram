const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- 1. Konfigurasi Database ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_perpustakaan',
  port: 3307
});

// --- 2. Hubungkan ke Database ---
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Terhubung ke database MySQL (db_perpustakaan).');
});

// --- 3. Root Endpoint ---
app.get('/', (req, res) => {
  res.send('Selamat datang di API Library Borrowing Tracker!');
});

// ===============================================
// === 4. CRUD Endpoints untuk Entitas BOOK ===
// ===============================================

// [POST] /api/books - Membuat buku baru
app.post('/api/books', (req, res) => {
  const { title, author, publication_year, genre } = req.body;
  // 'is_available' default 1 (true) saat buku baru ditambahkan
  const newBook = { title, author, publication_year, genre, is_available: 1 };
  const sql = "INSERT INTO BOOK SET ?";

  db.query(sql, newBook, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal menambah buku' });
    }
    res.status(201).json({ id: result.insertId, ...newBook });
  });
});

// [GET] /api/books - Mengambil semua buku
app.get('/api/books', (req, res) => {
  const sql = "SELECT * FROM BOOK";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal mengambil data buku' });
    }
    res.json(results);
  });
});

// [GET] /api/books/:id - Mengambil satu buku by ID
app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM BOOK WHERE book_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal mengambil data buku' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.json(result[0]);
  });
});

// [PUT] /api/books/:id - Memperbarui data buku
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, publication_year, genre, is_available } = req.body;
  const sql = "UPDATE BOOK SET title = ?, author = ?, publication_year = ?, genre = ?, is_available = ? WHERE book_id = ?";

  db.query(sql, [title, author, publication_year, genre, is_available, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal memperbarui buku' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.json({ message: 'Data buku berhasil diperbarui' });
  });
});

// [DELETE] /api/books/:id - Menghapus buku
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM BOOK WHERE book_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal menghapus buku' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Buku tidak ditemukan' });
    }
    res.json({ message: 'Buku berhasil dihapus' });
  });
});


// ===============================================
// === 5. CRUD Endpoints untuk Entitas MEMBER ===
// ===============================================

// [POST] /api/members - Membuat member baru
app.post('/api/members', (req, res) => {
  const { name, email, phone, membership_date } = req.body;
  const newMember = { name, email, phone, membership_date };
  const sql = "INSERT INTO MEMBER SET ?";

  db.query(sql, newMember, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal menambah member' });
    }
    res.status(201).json({ id: result.insertId, ...newMember });
  });
});

// [GET] /api/members - Mengambil semua member
app.get('/api/members', (req, res) => {
  const sql = "SELECT * FROM MEMBER";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal mengambil data member' });
    }
    res.json(results);
  });
});

// [GET] /api/members/:id - Mengambil satu member by ID
app.get('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM MEMBER WHERE member_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal mengambil data member' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Member tidak ditemukan' });
    }
    res.json(result[0]);
  });
});

// [PUT] /api/members/:id - Memperbarui data member
app.put('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, membership_date } = req.body;
  const sql = "UPDATE MEMBER SET name = ?, email = ?, phone = ?, membership_date = ? WHERE member_id = ?";

  db.query(sql, [name, email, phone, membership_date, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal memperbarui member' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Member tidak ditemukan' });
    }
    res.json({ message: 'Data member berhasil diperbarui' });
  });
});

// [DELETE] /api/members/:id - Menghapus member
app.delete('/api/members/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM MEMBER WHERE member_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal menghapus member' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Member tidak ditemukan' });
    }
    res.json({ message: 'Member berhasil dihapus' });
  });
});


// ===============================================
// === 6. CRUD Endpoints untuk Entitas LOAN ===
// ===============================================

// [POST] /api/loans - Membuat peminjaman baru
app.post('/api/loans', (req, res) => {
  const { borrow_date, due_date, book_id, member_id } = req.body;
  const newLoan = { borrow_date, due_date, book_id, member_id };
  const sql = "INSERT INTO LOAN SET ?";

  db.query(sql, newLoan, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal menambah data peminjaman. Pastikan book_id dan member_id ada.' });
    }
    res.status(201).json({ id: result.insertId, ...newLoan });
  });
});

// [GET] /api/loans - Mengambil semua peminjaman
app.get('/api/loans', (req, res) => {
  const sql = "SELECT * FROM LOAN";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal mengambil data peminjaman' });
    }
    res.json(results);
  });
});

// [GET] /api/loans/:id - Mengambil satu peminjaman by ID
app.get('/api/loans/:id', (req, res) => {
id } = req.params;
  const sql = "SELECT * FROM LOAN WHERE loan_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal mengambil data peminjaman' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }
    res.json(result[0]);
  });
});

// [PUT] /api/loans/:id - Memperbarui data peminjaman (misal saat pengembalian)
app.put('/api/loans/:id', (req, res) => {
  const { id } = req.params;
  const { borrow_date, due_date, return_date, book_id, member_id } = req.body;
  const sql = "UPDATE LOAN SET borrow_date = ?, due_date = ?, return_date = ?, book_id = ?, member_id = ? WHERE loan_id = ?";

  db.query(sql, [borrow_date, due_date, return_date, book_id, member_id, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal memperbarui peminjaman' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
    }
    res.json({ message: 'Data peminjaman berhasil diperbarui' });
  });
});

// [DELETE] /api/loans/:id - Menghapus peminjaman
app.delete('/api/loans/:id', (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM LOAN WHERE loan_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal menghapus peminjaman. Hapus denda terkait terlebih dahulu.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
  M }
    res.json({ message: 'Peminjaman berhasil dihapus' });
  });
});


// ===============================================
// === 7. CRUD Endpoints untuk Entitas FINE ===
// ===============================================

// [POST] /api/fines - Membuat denda baru
app.post('/api/fines', (req, res) => {
  const { loan_id, amount, fine_date, paid_status } = req.body;
  const newFine = { loan_id, amount, fine_date, paid_status: paid_status || 0 }; // Default 0 (false)
  const sql = "INSERT INTO FINE SET ?";

  db.query(sql, newFine, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal menambah denda. Pastikan loan_id ada.' });
    }
    res.status(201).json({ id: result.insertId, ...newFine });
  });
});

// [GET] /api/fines - Mengambil semua denda
app.get('/api/fines', (req, res) => {
  const sql = "SELECT * FROM FINE";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal mengambil data denda' });
    }
    res.json(results);
  });
});

// [GET] /api/fines/:id - Mengambil satu denda by ID
app.get('/api/fines/:id', (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM FINE WHERE fine_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal mengambil data denda' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Denda tidak ditemukan' });
    }
    res.json(result[0]);
  });
});

// [PUT] /api/fines/:id - Memperbarui data denda (misal saat dibayar)
app.put('/api/fines/:id', (req, res) => {
Route { id } = req.params;
  const { loan_id, amount, fine_date, paid_status } = req.body;
  const sql = "UPDATE FINE SET loan_id = ?, amount = ?, fine_date = ?, paid_status = ? WHERE fine_id = ?";

Setting up db.query(sql, [loan_id, amount, fine_date, paid_status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal memperbarui denda' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Denda tidak ditemukan' });
    }
    res.json({ message: 'Data denda berhasil diperbarui' });
  });
});

// [DELETE] /api/fines/:id - Menghapus denda
app.delete('/api/fines/:id', (req, res) => {
F const { id } = req.params;
  const sql = "DELETE FROM FINE WHERE fine_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Gagal menghapus denda' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Denda tidak ditemukan' });
    }
    res.json({ message: 'Denda berhasil dihapus' });
  });
});


// ===============================================
// === 8. Jalankan Server ===
// ===============================================
const port = 3000;
app.listen(port, () => {
  console.log(`Server backend berjalan di http://localhost:${port}`);
});
