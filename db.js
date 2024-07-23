const pgp = require("pg-promise")();
const db = pgp(
  `postgres://postgres:postgresql2024@localhost:5432/racourcisseur_url`
);

module.exports = db;
