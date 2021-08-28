require("dotenv").config();
const { Kafka } = require("kafkajs");
const { Pool } = require("pg");
const pool = new Pool();
const clientId = process.env.CLIENT_ID || "imaginfolio";
const groupId = process.env.GROUP_ID || "CONSUMER";
const brokers = process.env.BROKERS_LIST.split(",") || ["192.168.0.10:9092"];
const queryExecutor = (argv) => {
  return pool.query(process.env.PG_QUERY_STR, argv);
};
const run = async () => {
  const kafka = new Kafka({
    clientId: clientId,
    brokers: brokers,
  });
  const consumer = kafka.consumer({ groupId: groupId });
  await consumer.connect();
  console.log(`Consumer ${groupId} connected...`);
  consumer.subscribe({
    topic: process.env.TOPIC,
    fromBeginning: true,
  });
  console.log(`Consumer ${groupId} subscribed to topic ${process.env.TOPIC}`);
  consumer.run({
    eachMessage: async (result) => {
      const message = JSON.parse(result.message.value);
      queryExecutor(Object.values(message));
    },
  });
};
run();
