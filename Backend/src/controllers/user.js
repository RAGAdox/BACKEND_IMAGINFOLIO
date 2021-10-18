const formidable = require("formidable");
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
      error: `Could not find ${username} in database + ${err}`,
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
  let form = new formidable.IncomingForm();
  form.keepExtentions = true;
  form.multiples = true;
  form.parse(req, (err, fields, files) => {
    if (err)
      return res
        .status(400)
        .json({ success: false, error: "Unable to Parse Form" });
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
  let result = await createPost(post);
  return res.json(result);
};
exports.createPostDb = async (req, res) => {
  const { caption } = req.fields;
  let { tags } = req.fields;
  tags = tags ? tags.split(",") : [];
  const fileList = req.fileList;
  const post = {
    post_url: fileList,
    caption: caption,
    username: req.user.username,
    tags: tags,
  };

  let result = await savePost(post);
  return res.send(result);
};
exports.likePost = async (req, res) => {
  const { username } = req.user;
  const { postId } = req.post;
  let result = await likePost(postId, username);
  return res.json(result);
};
exports.commentPost = async (req, res) => {
  const { username } = req.user;
  const { postId } = req.post;
  const { commentText } = req.body;
  let result = await comment(postId, username, commentText);
  return res.json(result);
};
