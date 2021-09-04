require("dotenv").config();
const { Kafka } = require("kafkajs");
const clientId = process.env.POST_PRODUCER_CLIENT_ID || "imaginfolio";
const brokers = process.env.BROKERS_LIST.split(",");
console.log("BROKER LIST => ", brokers);
const kafka = new Kafka({
  clientId: clientId,
  brokers: brokers,
  connectionTimeout: 3000,
  requestTimeout: 25000,
});

const producer = kafka.producer();
producer.connect();
exports.likePost = async (postId, username) => {
  return producer.send({
    topic: "LIKE_POST",
    numPartitions: 3,
    messages: [
      {
        value: JSON.stringify({ postId: postId, username: username }),
      },
    ],
  });
};
exports.comment = async (postId, username, commentText) => {
  return producer.send({
    topic: "COMMENT_POST",
    numPartitions: 3,
    messages: [
      {
        value: JSON.stringify({
          postId: postId,
          username: username,
          commentText: commentText,
        }),
      },
    ],
  });
};
exports.createPost = async (post) => {
  return producer.send({
    topic: "CREATE_POST",
    numPartitions: 3,
    messages: [
      {
        value: JSON.stringify(post),
      },
    ],
  });
};
