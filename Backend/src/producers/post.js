require("dotenv").config();
const producer = require("./producer");
exports.likePost = async (postId, username, res) => {
  return producer.send(
    [
      {
        topic: "LIKE_POST",
        messages: JSON.stringify({ postId: postId, username: username }),
      },
    ],
    (err, data) => {
      if (err || !data) {
        return res.status(502).json({
          success: false,
          error: err,
          message: `Unable to process like operation`,
        });
      }
      return res.json({
        success: true,
        message: `Operation Successfull`,
      });
    }
  );
};

exports.comment = async (postId, username, commentText, res) => {
  return producer.send(
    [
      {
        topic: "COMMENT_POST",
        messages: JSON.stringify({
          postId: postId,
          username: username,
          commentText: commentText,
        }),
      },
    ],
    (err, data) => {
      if (err || !data) {
        return res.status(502).json({
          success: false,
          error: err,
          message: `Unable to process comment operation`,
        });
      }
      return res.json({
        success: true,
        message: `Operation Successfull`,
      });
    }
  );
};
exports.createPost = async (post, res) => {
  return producer.send(
    [{ topic: "CREATE_POST", messages: JSON.stringify(post) }],
    (err, data) => {
      if (err || !data) {
        return res.status(502).json({
          success: false,
          error: err,
          message: `Unable to process create post operation`,
        });
      }
      return res.json({
        success: true,
        message: `Operation Successfull`,
      });
    }
  );
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
      messages.push(filename);
    });

    producer.send(
      [{ topic: "UPLOAD_FILE", messages: messages }],
      (err, data) => {
        if (err || !data) {
          return res.status(502).json({
            success: false,
            error: err,
            message: `Unable to process create post operation`,
          });
        }
        next();
      }
    );
  } else {
    return res.status(400).json({ success: false, error: `Empty Files` });
  }
};
