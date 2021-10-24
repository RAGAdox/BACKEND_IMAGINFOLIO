require("dotenv").config();
const { Kafka } = require("kafkajs");
const clientId = process.env.CLIENT_ID || "imaginfolio";
const groupId = process.env.GROUP_ID || "CONSUMER_UPLOADER";
const brokers = process.env.BROKERS_LIST.split(",") || ["192.168.0.10:9092"];
console.log("Brokers: ", brokers);
const run = async () => {
  const kafka = new Kafka({ clientId: clientId, brokers: brokers });
  const consumer = kafka.consumer({ groupId: groupId });
  consumer.subscribe({ topic: process.env.TOPIC, fromBeginning: true });
  console.log(`Consumer ${groupId} subscribed to topic ${process.env.TOPIC}`);
  consumer.run({
    eachMessage: async (result) => {
      const filename = JSON.parse(result.message.value);
      console.log(filename);
    },
  });
};
run();
