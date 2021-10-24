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
exports.uploadFiles = async (req, res, next) => {
  let { files } = req.files || [];
  req.fileList = [];
  if (files && typeof files.length === "undefined") files = [files];
  if (files && files.length > 0) {
    let messages = [];
    files.forEach(({ path }) => {
      const filename = path.substring(path.lastIndexOf("/") + 1);
      req.fileList.push(filename);
      messages.push({ value: JSON.stringify(filename) });
    });
    producer.send({
      topic: "UPLOAD_FILE",
      numPartitions: 3,
      messages: messages,
    });
    next();
  } else {
    return res.status(400).json({ success: false, error: `Empty Files` });
  }
};
