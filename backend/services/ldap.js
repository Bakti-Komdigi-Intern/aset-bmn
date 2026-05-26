const { Client } = require("ldapts");

// ==============================
// CONFIG LDAP
// ==============================

const LDAP_CONFIGS = [

  {
    url:
      process.env.LDAP_URL_1,

    bindDN:
      process.env.LDAP_BIND_DN_1,

    bindPassword:
      process.env.LDAP_BIND_PASSWORD_1,

    searchBase:
      process.env.LDAP_SEARCH_BASE_1,

    searchFilter:
      "(uid={{username}})"
  },

  {
    url:
      process.env.LDAP_URL_2,

    bindDN:
      process.env.LDAP_BIND_DN_2,

    bindPassword:
      process.env.LDAP_BIND_PASSWORD_2,

    searchBase:
      process.env.LDAP_SEARCH_BASE_2,

    searchFilter:
      "(uid={{username}})"
  }

].filter(c => c.url);

// ==============================
// CREATE CLIENT
// ==============================

function createClient(url) {

  return new Client({

    url,

    timeout: 5000,

    connectTimeout: 5000
  });
}

// ==============================
// SEARCH USER
// ==============================

async function searchUser(
  client,
  config,
  username
) {

  const filter =
    config.searchFilter.replace(
      "{{username}}",
      username
    );

  console.log(
    "🔍 LDAP FILTER:",
    filter
  );

  const result =
    await client.search(
      config.searchBase,
      {
        scope: "sub",

        filter,

        attributes: [
          "uid",
          "mail",
          "cn",
          "dn"
        ]
      }
    );

  if (
    !result.searchEntries ||
    result.searchEntries.length === 0
  ) {

    return null;
  }

  const entry =
    result.searchEntries[0];

  return {

    uid:
      String(entry.uid || ""),

    email:
      String(entry.mail || ""),

    name:
      String(entry.cn || ""),

    dn:
      String(entry.dn || "")
  };
}

// ==============================
// AUTHENTICATE LDAP
// ==============================

async function authenticateLDAP(
  username,
  password
) {

  console.log(
    "🔐 LDAP LOGIN:",
    username
  );

  for (const config of LDAP_CONFIGS) {

    const client =
      createClient(config.url);

    try {

      // =========================
      // ADMIN BIND
      // =========================

      await client.bind(
        config.bindDN,
        config.bindPassword
      );

      console.log(
        "✅ LDAP ADMIN BIND:",
        config.url
      );

      // =========================
      // SEARCH USER
      // =========================

      const user =
        await searchUser(
          client,
          config,
          username
        );

      if (!user) {

        console.log(
          "❌ USER TIDAK DITEMUKAN"
        );

        await client.unbind();

        continue;
      }

      // =========================
      // LOGIN USER
      // =========================

      const userClient =
        createClient(config.url);

      try {

        await userClient.bind(
          user.dn,
          password
        );

        console.log(
          "✅ LDAP LOGIN BERHASIL:",
          user.uid
        );

        await userClient.unbind();
        await client.unbind();

        return user;

      } catch {

        console.log(
          "❌ PASSWORD LDAP SALAH"
        );

        await userClient.unbind();
        await client.unbind();

        return null;
      }

    } catch (err) {

      console.log(
        "❌ LDAP SERVER ERROR:",
        err.message
      );

      await client.unbind();

      continue;
    }
  }

  return null;
}

// ==============================
// ROLE SYSTEM
// ==============================

function getUserRole(username) {

  // =========================
  // LIST ADMIN
  // =========================

  const admins =
    (
      process.env.LDAP_ADMINS ||
      ""
    )
      .split(",")
      .map(v =>
        v.trim().toLowerCase()
      );

  const user =
    String(username || "")
      .trim()
      .toLowerCase();

  console.log(
    "👤 CHECK ROLE:",
    user
  );

  // =========================
  // ADMIN
  // =========================

  if (
    admins.includes(user)
  ) {

    console.log(
      "🛡 ROLE: ADMIN"
    );

    return "admin";
  }

  // =========================
  // DEFAULT USER
  // =========================

  console.log(
    "👨 ROLE: USER"
  );

  return "pegawai";
}

// ==============================
// EXPORT
// ==============================

module.exports = {

  authenticateLDAP,

  getUserRole
};