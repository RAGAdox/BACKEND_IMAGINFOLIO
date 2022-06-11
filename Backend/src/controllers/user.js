require("dotenv").config();
const path = require("path");
const { validationCheck } = require("../utils/validations");
const { getUser, getFeed } = require("../db/fetchData");
const { savePost } = require("../db/saveData");
const { likePost, comment, createPost } = require("../producers/post");
const { IncomingForm } = require("formidable");
exports.getUserFeed = async (req, res) => {
  const { username } = req.user;
  const limit = req.query.limit;
  const offset = req.query.offset;
  const feed = await getFeed(username, offset, limit);
  return res.json(feed);
};
exports.getUserByUsername = async (req, res, next, username) => {
  const user = await getUser(username).catch((err) =>
    res.json({
      error: `Could not find ${username} in database`,
      success: false,
    })
  );
  req.user = user;
  return next();
};
exports.getPostId = async (req, res, next, postId) => {
  req.post = {
    postId: postId,
  };
  next();
};
exports.parseForm = async (req, res, next) => {
  const fileType = ["image"];
  let form = new IncomingForm({
    keepExtensions: true,
    multiples: true,
    uploadDir: path.join(__dirname, process.env.UPLOAD_PATH),
  });
  form.onPart = (part) => {
    const { filename, mime } = part;
    if (filename && fileType.indexOf(mime.split("/")[0]) === -1) {
      form._error(new Error("File Type Not Supported"));
    }
    if (!filename || fileType.indexOf(mime.split("/")[0]) !== -1) {
      form.handlePart(part);
    }
  };
  form.parse(req, (err, fields, files) => {
    if (err)
      return res
        .status(400)
        .json({ success: false, error: "Unable to Parse Form", debug: err });
    else {
      req.files = files;
      req.fields = fields;
      next();
    }
  });
};
exports.createPost = async (req, res) => {
  const fileList = req.fileList;
  let { caption, tags } = req.fields;
  tags = tags ? tags.split(",") : [];
  const post = {
    username: req.user.username,
    fileList,
    caption,
    tags,
  };
  return createPost(post, res);
};
exports.likePost = async (req, res) => {
  const { username } = req.user;
  const { postId } = req.post;
  return likePost(postId, username, res);
};
exports.commentPost = async (req, res) => {
  const { username } = req.user;
  const { postId } = req.post;
  const { commentText } = req.body;
  return comment(postId, username, commentText, res);
};
