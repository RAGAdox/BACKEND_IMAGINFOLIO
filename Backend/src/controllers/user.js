const formidable = require("formidable");
const { validationCheck } = require("../utils/validations");
const { getUser, getFeed } = require("../db/fetchData");
const { savePost } = require("../db/saveData");
const { likePost, comment } = require("../producers/post");
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
exports.createPost = async (req, res) => {
  const { caption } = req.fields;
  const fileList = req.fileList;
  const post = {
    post_url: fileList,
    caption: caption,
    username: req.user.username,
    tags: [],
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
