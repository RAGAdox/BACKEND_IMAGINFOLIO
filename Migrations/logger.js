const pino = require("pino");
const stdSerializers = require("pino-std-serializers");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  serializers: {
    err: (err) => {
      return stdSerializers.err(err);
    },
  },
});

module.exports = logger;
