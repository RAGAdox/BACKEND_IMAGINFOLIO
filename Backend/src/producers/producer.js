const kafka = require("kafka-node");
const kafkaHost = process.env.BROKERS_LIST;
const client = new kafka.KafkaClient({ kafkaHost: kafkaHost });
const producer = new kafka.Producer(client, { partitionerType: 1 });
console.log(`Initializing Producer ...`);
module.exports = producer;
