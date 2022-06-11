const path = require("path");
const { getClient } = require("./client");
const logger = require("./logger");
const Postgrator = require("postgrator");
const seedSchema = async () => {
  const client = getClient();
  await client
    .connect()
    .then(() => logger.info({ msg: "CLIENT CONNECTED SUCCESSFULLY" }));
  const postgrator = new Postgrator({
    migrationPattern: __dirname + "/bootstrap/*",
    driver: "pg",
    database: "imaginfolio",
    schemaTable: "bootstrap",
    execQuery: (query) => client.query(query),
  });
  postgrator.on("migration-started", ({ filename, action, version }) =>
    logger.info({ msg: "MIGRATION STARTED", filename, action, version })
  );
  postgrator.on("migration-finished", ({ filename, action, version }) =>
    logger.info({ msg: "MIGRATION FINISHED", filename, action, version })
  );
  await postgrator.migrate();
  logger.info("BOOTSTRAP COMPLETED");
  await client.end();
};

module.exports = { seedSchema };
