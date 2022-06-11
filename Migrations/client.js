const pg = require("pg");

const user = "imaginfolio";
const host = "0.0.0.0";
const database = "imaginfolio";
const password = "imaginfolio";
const port = "5432";
const ssl = false;

const getClient = () => {
  return new pg.Client({
    host,
    port,
    database,
    user,
    password,
    ssl,
  });
};

module.exports = { getClient };
