require("dotenv").config();
const brokers = process.env.BROKERS_LIST;
const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: brokers });

const consumer = new kafka.Consumer(client, [{ topic: process.env.TOPIC }]);

consumer.on("error", (err) => {
  console.log(`Error while consuming ${err}`);
});

consumer.on("message", (message) => {
  console.log("message", message.value);
});
