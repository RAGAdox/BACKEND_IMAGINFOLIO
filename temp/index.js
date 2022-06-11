const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: "localhost:29092" });
const producer = new kafka.Producer(client);
const payload = [
  {
    topic: "temp",
    messages: ["Hiii there", "RAGAdox"],
  },
];
producer.on("ready", () => {
  console.log(`Producer is ready`);
  producer.send(payload, (err, data) => {
    console.log("data", data);
  });
});
producer.on("error", (err) => {
  console.log(`Error while creating producer`);
});
const consumer = new kafka.Consumer(client, [{ topic: "temp" }]);
consumer.on("error", (err) => {
  console.log(`Error while consuming ${err}`);
});
consumer.on("message", (message) => {
  console.log("message", message);
});
module.exports = { kafka, consumer, producer };
