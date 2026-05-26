require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const { JWT_SECRET } = require("./config/jwt");

const {
  authenticateLDAP,
  getUserRole
} = require("./services/ldap");

const {
  syncUserFromLDAP
} = require("./services/user-sync");

const app = express();

// ===================================
// CONFIG
// ===================================

const PORT = 3001;


// ===================================
// MIDDLEWARE
// ===================================

app.use(cors());

app.use(express.json());

// ===================================
// SERVE FRONTEND
// ===================================

const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

console.log("🚀 Server starting...");
console.log(
  "LDAP URL:",
  process.env.LDAP_URL_1
);

// ===================================
// DATABASE
// ===================================

const db = mysql.createConnection({

  host:
    process.env.DB_HOST ||
    "172.16.10.239",

  user:
    process.env.DB_USER ||
    "baktiuser",

  password:
    process.env.DB_PASSWORD ||
    "Bakti2025.",

  database:
    process.env.DB_NAME ||
    "aset_bakti"
});

db.connect((err) => {

  if (err) {

    console.log(
      "❌ DB ERROR:",
      err
    );

  } else {

    console.log(
      "✅ Database connected"
    );
  }
});

// ===================================
// AUTH MIDDLEWARE
// ===================================

function authMiddleware(
  req,
  res,
  next
) {

  try {

    const authHeader =
      req.headers.authorization;

    // Debug: apakah server pakai secret dari env atau fallback.
    // (Tidak print nilai secret untuk keamanan)
    console.log(
      "🔧 JWT_SECRET source:",
      process.env.JWT_SECRET ? "env" : "fallback"
    );

    // Debug: header auth yang diterima (cukup cek keberadaan, bukan isi)
    console.log("🧪 Authorization header present:", !!authHeader);

    if (!authHeader) {

      return res.status(401).json({
        message:
          "Token tidak ada"
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        message:
          "Token invalid"
      });
    }

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    req.user = decoded;

    next();

  } catch (err) {

    console.log(
      "❌ JWT ERROR:",
      err.message
    );

    return res.status(401).json({
      message:
        "Token tidak valid"
    });
  }
}

// ===================================
// ADMIN MIDDLEWARE
// ===================================

function adminMiddleware(
  req,
  res,
  next
) {

  if (
    req.user.role !==
    "admin"
  ) {

    return res.status(403).json({
      message:
        "Akses admin ditolak"
    });
  }

  next();
}

// ===================================
// LOGIN LDAP
// ===================================

app.post(
  "/login",

  async (req, res) => {

    try {

      const {
        username,
        password
      } = req.body;

      if (
        !username ||
        !password
      ) {

        return res.status(400).json({
          message:
            "Username dan password wajib diisi"
        });
      }

      console.log(
        "🔐 LOGIN:",
        username
      );

      // =========================
      // LDAP AUTH
      // =========================

      const ldapUser =
        await authenticateLDAP(
          username,
          password
        );

      if (!ldapUser) {

        return res.status(401).json({
          message:
            "Login LDAP gagal"
        });
      }

      console.log(
        "✅ LDAP SUCCESS:",
        ldapUser
      );

      // =========================
      // ROLE
      // =========================

      const role =
        getUserRole(
          ldapUser.uid
        );

      // =========================
      // SYNC USER
      // =========================

      const user =
        await syncUserFromLDAP(
          db,
          {
            nip:
              ldapUser.uid,

            nama:
              ldapUser.name ||
              ldapUser.uid,

            role
          }
        );

      // =========================
      // JWT TOKEN
      // =========================

      const token =
        jwt.sign(
          {
            id: user.id,

            nip: user.nip,

            nama: user.nama,

            role: user.role
          },

          JWT_SECRET,

          {
            expiresIn: "1d"
          }
        );

      // =========================
      // SUCCESS
      // =========================

      res.json({

        success: true,

        token,

        user: {

          id: user.id,

          nip: user.nip,

          nama: user.nama,

          role: user.role
        }
      });

    } catch (err) {

      console.log(
        "❌ LOGIN ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Server error"
      });
    }
  }
);

// ===================================
// GET ASET
// ===================================

app.get(
  "/aset",

  authMiddleware,

  async (req, res) => {

    try {

      let sql = "";
      let params = [];

      // =========================
      // ADMIN
      // =========================

      if (
        req.user.role ===
        "admin"
      ) {

        sql = `
          SELECT
            a.id,

            IFNULL(
              p.unit_kerja,
              '-'
            ) AS direktorat,

            IFNULL(
              p.nama,
              '-'
            ) AS namaKaryawan,

            a.nama_aset AS namaAset,

            IFNULL(
              k.nama_kategori,
              '-'
            ) AS merkAset,

            IFNULL(
              a.serial_number,
              '-'
            ) AS spesifikasiAset,

            a.kondisi,

            a.tahun_pengadaan
              AS tahunPerolehan,

            IFNULL(
              a.label_aset,
              'Tidak Ada'
            ) AS labelAset

          FROM aset a

          LEFT JOIN pegawai p
            ON a.pegawai_id = p.id

          LEFT JOIN kategori_aset k
            ON a.kategori_id = k.id

          ORDER BY a.id DESC
        `;

      } else {

        // =========================
        // PEGAWAI
        // =========================

        sql = `
          SELECT
            a.id,

            IFNULL(
              p.unit_kerja,
              '-'
            ) AS direktorat,

            IFNULL(
              p.nama,
              '-'
            ) AS namaKaryawan,

            a.nama_aset AS namaAset,

            IFNULL(
              k.nama_kategori,
              '-'
            ) AS merkAset,

            IFNULL(
              a.serial_number,
              '-'
            ) AS spesifikasiAset,

            a.kondisi,

            a.tahun_pengadaan
              AS tahunPerolehan,

            IFNULL(
              a.label_aset,
              'Tidak Ada'
            ) AS labelAset

          FROM aset a

          LEFT JOIN pegawai p
            ON a.pegawai_id = p.id

          LEFT JOIN kategori_aset k
            ON a.kategori_id = k.id

          WHERE p.nip = ?

          ORDER BY a.id DESC
        `;

        params = [
          req.user.nip
        ];
      }

      const [result] =
        await db.promise().query(
          sql,
          params
        );

      res.json(result);

    } catch (err) {

      console.log(
        "❌ GET ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Gagal mengambil data"
      });
    }
  }
);

// ===================================
// IMPORT ASET
// ===================================

app.post(
  "/import-excel",

  authMiddleware,

  async (req, res) => {

    try {

      const data =
        req.body;

      for (const row of data) {

        if (!row.namaAset)
          continue;

        // =====================
        // PEGAWAI
        // =====================

        let pegawaiId;

        const [pegawai] =
          await db.promise().query(
            `
            SELECT id
            FROM pegawai
            WHERE nama = ?
            `,
            [row.namaKaryawan]
          );

        if (
          pegawai.length > 0
        ) {

          pegawaiId =
            pegawai[0].id;

        } else {

          const result =
            await db.promise().query(
              `
              INSERT INTO pegawai
              (
                nama,
                unit_kerja,
                nip
              )
              VALUES (?,?,?)
              `,
              [
                row.namaKaryawan || "-",

                row.direktorat || "-",

                req.user.nip
              ]
            );

          pegawaiId =
            result[0].insertId;
        }

        // =====================
        // KATEGORI
        // =====================

        let kategoriId;

        const [kategori] =
          await db.promise().query(
            `
            SELECT id
            FROM kategori_aset
            WHERE nama_kategori = ?
            `,
            [row.merkAset]
          );

        if (
          kategori.length > 0
        ) {

          kategoriId =
            kategori[0].id;

        } else {

          const result =
            await db.promise().query(
              `
              INSERT INTO kategori_aset
              (
                nama_kategori
              )
              VALUES (?)
              `,
              [
                row.merkAset || "-"
              ]
            );

          kategoriId =
            result[0].insertId;
        }

        // =====================
        // INSERT ASET
        // =====================

        await db.promise().query(
          `
          INSERT INTO aset
          (
            nama_aset,
            kategori_id,
            pegawai_id,
            serial_number,
            kondisi,
            tahun_pengadaan,
            lokasi,
            label_aset
          )
          VALUES (?,?,?,?,?,?,?,?)
          `,
          [

            row.namaAset,

            kategoriId,

            pegawaiId,

            row.spesifikasiAset || "",

            row.kondisi || "Baik",

            row.tahunPerolehan ||
              null,

            "Jakarta",

            row.labelAset ||
              "Tidak Ada"
          ]
        );
      }

      res.json({
        success: true,
        message:
          "✅ Data berhasil disimpan"
      });

    } catch (err) {

      console.log(
        "❌ IMPORT ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Import gagal"
      });
    }
  }
);

// ===================================
// UPDATE ASET
// ===================================

app.put(
  "/aset/:id",

  authMiddleware,

  adminMiddleware,

  async (req, res) => {

    try {

      const id =
        req.params.id;

      const row =
        req.body;

      await db.promise().query(
        `
        UPDATE aset SET

          nama_aset=?,

          serial_number=?,

          kondisi=?,

          tahun_pengadaan=?,

          label_aset=?

        WHERE id=?
        `,
        [

          row.namaAset,

          row.spesifikasiAset,

          row.kondisi,

          row.tahunPerolehan,

          row.labelAset,

          id
        ]
      );

      res.json({
        success: true,
        message:
          "✅ Update berhasil"
      });

    } catch (err) {

      console.log(
        "❌ UPDATE ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Update gagal"
      });
    }
  }
);

// ===================================
// DELETE ASET
// ===================================

app.delete(
  "/aset/:id",

  authMiddleware,

  adminMiddleware,

  async (req, res) => {

    try {

      await db.promise().query(
        `
        DELETE FROM aset
        WHERE id=?
        `,
        [req.params.id]
      );

      res.json({
        success: true,
        message:
          "✅ Deleted"
      });

    } catch (err) {

      console.log(
        "❌ DELETE ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Delete gagal"
      });
    }
  }
);

// ===================================
// TEST TOKEN
// ===================================

app.get(
  "/me",

  authMiddleware,

  (req, res) => {

    res.json({
      success: true,
      user: req.user
    });
  }
);

// ===================================
// START SERVER
// ===================================
// SPA Fallback - Route yang tidak dikenali diredirect ke index.html
app.use((req, res, next) => {
  // Skip jika request ke API
  if (req.path.startsWith('/api') || req.path.startsWith('/login') || req.path.startsWith('/aset') || req.path.startsWith('/me')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, "0.0.0.0", () => {

  console.log("🚀 Server running");

  console.log(
    `🚀http://localhost:${PORT}`
  );

  console.log(
    `🚀http://192.168.1.121:${PORT}`
  );
});