const logger = require("./logger");
const { getClient } = require("./client");
const setupSchema = async (schema = "public") => {
  const client = getClient();
  await client
    .connect()
    .then(() => logger.info({ msg: "CLIENT CONNECTED SUCCESSFULLY" }));
  await client
    .query(`create schema  if not exists ${schema}`)
    .then(() => logger.info({ msg: `${schema} SETUP SUCCESSFUL` }));
};

module.exports = { setupSchema };
