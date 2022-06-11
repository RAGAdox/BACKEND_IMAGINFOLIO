const path = require("path");
const pg = require("pg");
const Postgrator = require("postgrator");
const logger = require("./logger");

const { getClient } = require("./client");
const { setupSchema } = require("./setupSchema");
const { seedSchema } = require("./seedSchema");
const migratePublicSchema = async () => {
  const client = getClient();
  await client
    .connect()
    .then(() => logger.info({ msg: "CLIENT CONNECTED SUCCESSFULLY" }));
  const postgrator = new Postgrator({
    migrationPattern: __dirname + "/migrations/public/*",
    driver: "pg",
    database: "imaginfolio",
    execQuery: (query) => client.query(query),
  });
  postgrator.on("migration-started", ({ filename, action, version }) =>
    logger.info({ msg: "MIGRATION STARTED", filename, action, version })
  );
  postgrator.on("migration-finished", ({ filename, action, version }) =>
    logger.info({ msg: "MIGRATION FINISHED", filename, action, version })
  );
  await postgrator.migrate();
  logger.info("MIGRATION COMPLETED");
  await client.end();
};

const bootstrap = async () => {
  await setupSchema();
  await migratePublicSchema();
  await seedSchema();
  process.exit();
};

const runCompleteFlow = async () => {
  await setupSchema();
  await migratePublicSchema();
  process.exit();
};

module.exports = { migratePublicSchema, setupSchema, bootstrap };

if (require.main === module) {
  runCompleteFlow();
}
