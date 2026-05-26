async function syncUserFromLDAP(
  db,
  ldapUser
) {

  try {

    const [users] =
      await db.promise().query(
        `
        SELECT *
        FROM users
        WHERE nip=?
        `,
        [ldapUser.nip]
      );

    // =========================
    // USER SUDAH ADA
    // =========================

    if (users.length > 0) {

      const user = users[0];

      // update nama kalau berubah

      if (
        user.nama !== ldapUser.nama
      ) {

        await db.promise().query(
          `
          UPDATE users
          SET nama=?
          WHERE nip=?
          `,
          [
            ldapUser.nama,
            ldapUser.nip
          ]
        );

        console.log(
          "✅ User updated:",
          ldapUser.nip
        );
      }

      return user;
    }

    // =========================
    // USER BELUM ADA
    // =========================

    const role =
      ldapUser.role || "pegawai";

    await db.promise().query(
      `
      INSERT INTO users
      (
        nip,
        nama,
        password,
        role
      )
      VALUES (?,?,?,?)
      `,
      [
        ldapUser.nip,
        ldapUser.nama,
        "LDAP_AUTH",
        role
      ]
    );

    console.log(
      "✅ User baru dibuat:",
      ldapUser.nip
    );

    // ambil user baru

    const [newUser] =
      await db.promise().query(
        `
        SELECT *
        FROM users
        WHERE nip=?
        `,
        [ldapUser.nip]
      );

    return newUser[0];

  } catch (err) {

    console.log(
      "❌ SYNC ERROR:",
      err
    );

    throw err;
  }
}

module.exports = {
  syncUserFromLDAP
};